import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {}

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('dynamicCronSample');

    job.start();
    console.log('start!! ', job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('dynamicCronSample');

    job.stop();
    console.log('stopped!! ', job.lastDate());
  }
}
