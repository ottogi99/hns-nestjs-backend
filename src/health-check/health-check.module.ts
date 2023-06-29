import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './dog-health';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
  ],
  providers: [DogHealthIndicator],
  controllers: [HealthCheckController]
})
export class HealthCheckModule {}
