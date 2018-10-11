var CronJob = require('cron').CronJob;
const job = new CronJob('* * 0 * * *', function() {
	const d = new Date();
    console.log('Every second:', d);
    
});
job.start();