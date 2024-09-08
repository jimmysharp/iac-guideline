---
title: コーディングスタイル
description: Terraformコードスタイル
---

## フォーマット

`terraform fmt`によるフォーマットに従います

- インデントは2スペースを使用します
- 連続する2行ではスペースの位置を揃えます

```hcl
ami           = "abc123"
instance_type = "t2.micro"
```

## リソース名

- リソース名はsnake_caseとし、ダブルクォーテーションで囲います
- 変数名にはリソース名・名前空間(モジュール名など)と重複する内容は含めないようにします
  - 説明すべき名前がない場合は`this`とします

:::danger[Bad]
ex) web_apiモジュール

```hcl
resource aws_lb webApiLb {}

resource aws_lb_listener webApiLb_httpsListener {}
```

:::
:::note[Good]
ex) web_apiモジュール

```hcl
resource "aws_lb" "this" {}

resource "aws_lb_listener" "https" {}
```

:::

## コメント

- コメントには`#`を用いるものとし、`//`は使用しません

```hcl
#
resource "aws_lb" "this" {

}
```

## パラメータ順序

パラメータは以下の順序で指定します

1. メタ変数 (count、for_each)
2. 非ブロックパラメータ
3. ブロックパラメータ
4. タグ
5. lifecycleブロック
6. depends_onブロック

```hcl
resource "aws_instance" "example" {
  # メタ変数
  count = 2

  # 非ブロックパラメータ
  ami           = "abc123"
  instance_type = "t2.micro"

  # ブロックパラメータ
  network_interface {
    # ...
  }

  # タグ
  tags = {
    Name = "hoge"
  }

  # lifecycleブロック
  lifecycle {
    create_before_destroy = true
  }

  # depends_onブロック
  depends_on {
    # ...
  }
}
```

## Variables

- `type`および`description`を必ず記載します
- 秘密情報は`sensitive = true`を付与します
- パラメータに制約条件がある場合、`validation`ブロックを活用します
- パラメータは以下の順序で記載します
  1. type
  2. description
  3. default
  4. sensitive
  5. validation

```
variable "db_password" {
  type        = "string"
  description = "DBのルートパスワード"
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 8
    error_message = "db_passwordは8文字以上で設定してください"
  }
}
```

- 変数名には単位を付けることを推奨します

:::caution[Not so good]

```
variables "max_memory" {}
```

:::

:::note[Better]

```
variables "max_memory_gigabytes" {}
```

:::

## Outputs

- `type`および`description`を必ず記載します
- パラメータは以下の順序で記載します
  1. description
  2. value
  3. sensitive

```hcl
output "db_writer_endpoint" {
  desctiption = "DBの書き込みエンドポイントDNS名"
  value       = aws_rds_cluster.hoge.endpoint
}
```

## 参考

- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
