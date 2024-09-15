---
title: プロジェクト構造
description: Terraformプロジェクトのディレクトリ構造と役割
---

## ディレクトリ

Terraformプロジェクトのディレクトリ構造は以下のように設計します。

```
project_root/
├ envs/
│ └ {env_name}/
│ 　 ├ .terraform.lock.hcl
│ 　 ├ backend.tf
│ 　 ├ data.tf
│ 　 ├ locals.tf
│ 　 ├ main.tf
│ 　 ├ providers.tf
│ 　 ├ terraform.tf
│ 　 ├ terraform.tfvars
│ 　 └ variables.tf
└ modules/
　 └ {module_name}/
　 　 ├ {resource_group}.tf
　 　 ├ locals.tf
　 　 ├ outputs.tf
　 　 ├ README.md
　 　 ├ terraform.tf
　 　 └ variables.tf
```

:::info
ex) VPCとフロント・バックエンドシステムがあり、本番・検証環境の2環境がある場合

```
project_root/
├ envs/
│ ├ production/
│ └ staging/
└ modules/
　 ├ vpc/
　 ├ frontend/
　 └ backend/
```

:::

### envs/

環境(本番環境、検証環境...etc)ごとにディレクトリを用意します。
各環境ごとのディレクトリがTerraformコマンドの実行ディレクトリ(ルートモジュール)となります。

```sh
# 例
cd envs/production
terraform init
terrafom apply
```

各ディレクトリには以下のファイルを設置します。

#### .terraform.lock.hcl

`terraform init`によって生成されるロックファイル。

#### backend.tf

Terraformのtfstateファイル保存先となるバックエンドの定義を記載します。

```hcl
terraform {
  backend "s3" {
    bucket = "my-state-bucket"
    key    = "path/to/tfstate"
    region = "ap-northeast-1"
  }
}
```

#### data.tf

dataブロックによる既存リソースなどへの参照がある場合に記載します。

```hcl
data "aws_current_region" "this" {}
```

#### locals.tf

環境ごとに異なる設定値をlocalsにより記載。main.tfから参照され、モジュールに与える引数として利用します。

全ての設定値を本ファイルにまとめる必要はなく、1回しか利用しない設定値などは`main.tf`にべた書きします。

```hcl
locals {
  app_name = "myapp"
  env_name = "prd"

  vpc_cidr_v4 = "10.0.0.0/16"
  ...
}
```

#### main.tf

すべてのリソース作成を記載します。

原則として`modules/`以下のモジュールを呼び出すことにより実現し、本ファイル内でresourceブロックは記述しません。

```hcl
module "vpc" {
  source = "../../modules/vpc"

  app_name = local.app_name
  env_name = local.env_name

  vpc_cidr_v4 = local.vpc_cidr_v4
  ...
}

module "frontend" {
  source = "../../modules/frontend"

  app_name = local.app_name
  env_name = local.env_name

  lb_subnet_ids  = module.vpc.public_subnet_ids
  ecs_subnet_ids = module.vpc.private_subnet_ids
  ...
}
```

#### providers.tf

providerブロックによる各プロバイダーごとの設定を記載します。

```hcl
provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}
```

#### terraform.tf

Terraform本体、およびすべてのプロバイダーのバージョン制約を記載します。

```hcl
terraform {
  required_version = "1.9.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.67.0"
    }
  }
}
```

#### terraform.tfvars

`variables.tf`で指定した変数の値を記載します。

本ファイルの内容は秘密情報であり、**Gitにコミットしてはなりません**。

```
database_user     = "xxxxxx"
database_password = "xxxxxx"
```

#### variables.tf

Terraform実行に必要な値のうち、Gitコミットしてはならない秘密情報を外部から与えられるようにするため、variableとして記載します。値は上記`terraform.tfvars`で管理します。

秘密情報での利用を前提としているため、すべての変数に`sensitive = true`を付与します。

```hcl
variable "database_user" {
  type        = string
  sensitive   = true
  description = "マスタデータベースのログインユーザ名"
}

variable "database_password" {
  type        = string
  sensitive   = true
  description = "マスタデータベースのログインパスワード"
}
```

### modules/

機能ごとに作成したモジュールを設置します。

:::note
Terraform公式からTerraform Standard Module Structureが推奨されていますが、これは再配布を前提としたモジュール構成となっており、単一プロジェクト内での利用には過剰な面が多いものとなっています。

本ガイドラインでは可読性・メンテナンス性を重視し、一部の内容で改変を行っています。
:::

各モジュールは以下のファイル構成を取ります。

#### {resource_group}.tf

resourceブロックによるリソース作成を記載します。

Terraformプロバイダーが採用するリソース種別によりグループ化を行い、グループごとにファイルを用意します。
サービス名変更などでプロバイダー上のグループが実態と異なる場合(Kinesis Firehose -> Data Firehoseなど)、無理にグループを一致させる必要はありません。また適宜短縮名を採用します。

```
frontend/
├ autoscaling.tf
├ cwalarm.tf
├ cwlogs.tf
├ ecr.tf
├ ecs.tf
├ iam.tf
├ lb.tf
├ r53.tf
└ sg.tf
```

#### locals.tf

モジュール内で共通利用する変数を記載します。

固定値だけでなく、variablesから算出する値などにも利用します。

```hcl
locals {
  prefix = "${var.app_name}-${var.env_name}"
}
```

#### outputs.tf

outputブロックを記載します。

予め汎用的に記載するのではなく、必要になった段階で追加する形とします。

```hcl
output "ecs_sg_id" {
  desctription = "アプリケーション用ECSタスクのセキュリティグループID"
  value        = aws_security_group.ecs.id
}
```

#### README.md

モジュールの概要や制約条件を記載します。

[terraform-docs](https://github.com/terraform-docs/terraform-docs)を使用し、variablesおよびoutputsを出力するようにします。

```markdown
# vpc

VPC作成モジュール。
public、private、databaseの3種のサブネットを作成する。
AZ数はaz_defの指定に従う。

- publicサブネットのみIPv6有効となる
- NAT GWはAZごとに作成され、private subnetは同一AZのNAT GWを使用する
- ap-northeast-1のS3、Dynamo DBのみVPCエンドポイント経由での通信となる

<!-- BEGIN_TF_DOCS -->

(terraform-docsによる出力)

<!-- END_TF_DOCS -->
```

#### terraform.tf

モジュール独自のプロバイダー制約がある場合に記載します。

モジュール内で複数リージョンを扱う場合に、プロバイダーのエイリアスを要求するなどの場合に使用します。

```hcl
# aws.virginiaエイリアスを必須とする
terraform {
  required_providers {
    aws = {
      configuration_aliases = [aws.virginia]
    }
  }
}
```

#### variables.tf

variablesブロックを記載します。

```hcl
variable "vpc_cidr_v4" {
  type        = string
  description = "VPCに割り当てるIPv4 CIDRブロック"
}
```

## 参考

- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
- [Terraform Standard Module Structure](https://developer.hashicorp.com/terraform/language/modules/develop/structure)
