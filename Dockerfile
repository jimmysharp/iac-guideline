FROM node:20.15.1-bookworm
WORKDIR /app

RUN apt-get update -y && \
  apt-get install -y vim locales && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN sed -i -e 's/# \(ja_JP.UTF-8\)/\1/' /etc/locale.gen && \
  locale-gen && \
  update-locale LANG=ja_JP.UTF-8

RUN corepack enable
