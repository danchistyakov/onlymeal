const schedule = require('node-schedule');

exports.Cancel = () => {
    const cancel = schedule.scheduledJobs;
    for (i = 0; i < Object.keys(cancel).length; i++) {
        cancel[Object.keys(cancel)[i]].cancel();
    }
}