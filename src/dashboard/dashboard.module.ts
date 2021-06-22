import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  providers: [DashboardService, JwtAuthGuard],
  controllers: [DashboardController]
})
export class DashboardModule {}
