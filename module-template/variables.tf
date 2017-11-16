
variable "prefix" {}

# 実行roleのarn
variable "iam_for_lambda_arn" {}

# 個別の名前
variable "name" {}

# 対象インスタンスIDの文字列（[, ]区切り）
variable "target_instances" {}

# スケジュール設定
variable "schedule_name" {}
variable "schedule_expression" {}

# 休みの追加（半角スペース[ ]区切り）
variable "additional_holidays" {
	default = ""
}
