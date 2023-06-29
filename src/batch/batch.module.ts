import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { BatchController } from './batch.controller';
import { DynamicTaskService } from './dynamic-task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [
    // TaskService,
    DynamicTaskService,
  ],
  controllers: [
    BatchController,
  ]
})
export class BatchModule {}
