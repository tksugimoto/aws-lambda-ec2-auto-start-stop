
resource "aws_cloudwatch_event_rule" "schedule" {
	name = "${var.prefix}-${var.name}-${var.schedule_name}"
	schedule_expression = "${var.schedule_expression}"
}

resource "aws_cloudwatch_event_target" "schedule_target" {
	rule = "${aws_cloudwatch_event_rule.schedule.name}"
	arn = "${aws_lambda_function.main.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda" {
	statement_id = "AllowExecutionFromCloudWatch"
	action = "lambda:InvokeFunction"
	function_name = "${aws_lambda_function.main.function_name}"
	principal = "events.amazonaws.com"
	source_arn = "${aws_cloudwatch_event_rule.schedule.arn}"
}
