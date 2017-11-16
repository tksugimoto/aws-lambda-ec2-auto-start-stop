'use strict';

const JapaneseHolidays = require('japanese-holidays');
const AWS = require('aws-sdk');

/**** 設定ここから ****/
const targetInstancesStr = process.env.target_instances_str;
const additionalHolidaysStr = process.env.additional_holidays;
/**** 設定ここまで ****/

exports.handler = (event, context) => {

	const japaneseTomorrow = (() => {
		const today = new Date();
		const day = +1;
		const hour = +9;
		const min = today.getTimezoneOffset();
		return new Date(today.getTime() + ((day * 24 + hour) * 60 + min) * 60 * 1000);
	})();

	console.log('stop', {
		targetInstancesStr,
		additionalHolidaysStr,
	});

	const fire = message => {
		console.log(message);
		ec2Stop(() => {
			context.done(null, 'Stoped Instance');
		});
	};

	if (isWeekend(japaneseTomorrow)) return fire('週末のためSTOP');
	if (isAdditionalHoliday(japaneseTomorrow)) return fire('追加指定休日のためSTOP');
	if (isHoliday(japaneseTomorrow)) return fire('祝日のためSTOP');

	console.log('明日も営業日のためSTOPしない');
};

const ec2Stop = cb => {
	const ec2 = new AWS.EC2();
	const params = {
		InstanceIds: targetInstancesStr.trim().split(/(?:\s|,)+/),
	};
	ec2.stopInstances(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(data);
			cb();
		}
	});
};

const isWeekend = japaneseDate => {
	const day = japaneseDate.getDay();
	const sunday = 0;
	const saturday = 6;
	return day === sunday || day === saturday;
};

const isAdditionalHoliday = japaneseDate => {
	const additionalHolidays = additionalHolidaysStr.trim().split(/\s+/).reduce((array, dateStr) => {
		if (dateStr.match(/(\d+)[/](\d+)(?:-(\d+))?/)) {
			const month = parseInt(RegExp.$1);
			const startDay = parseInt(RegExp.$2);
			const endDay = parseInt(RegExp.$3 || startDay);
			for (let day = startDay; day <= endDay; day++) {
				array.push(`${month}/${day}`);
			}
		}
		return array;
	}, []);

	const targetDate = `${japaneseDate.getMonth() + 1}/${japaneseDate.getDate()}`;
	return additionalHolidays.some(date => {
		return date === targetDate;
	});
};

const isHoliday = japaneseDate => {
	return !!JapaneseHolidays.isHoliday(japaneseDate);
};
