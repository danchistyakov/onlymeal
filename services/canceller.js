import {scheduledJobs} from 'node-schedule';

const Cancel = () => {
  const cancel = scheduledJobs;
  for (let i = 0; i < Object.keys(cancel).length; i++) {
    cancel[Object.keys(cancel)[i]].cancel();
  }
}

export default Cancel;