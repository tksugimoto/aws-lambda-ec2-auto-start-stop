###### 変数定義 ######
# AWS APIキー変数設定
variable "aws_access_key" {}

variable "aws_secret_key" {}

# 名前のPrefix
variable "prefix" {}

# リージョン
variable "region" {}

# Lambda用roleのarn
variable "iam_for_lambda_arn" {}

###### AWS基本設定 ######
provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.region}"
}
