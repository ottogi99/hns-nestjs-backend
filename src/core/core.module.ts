import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CoreService],
  exports: [CommonModule],
})
export class CoreModule {}
