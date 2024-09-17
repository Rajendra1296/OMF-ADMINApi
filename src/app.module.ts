import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './Admin/admin.controller';
import { AdminService } from './Admin/admin.service';

@Module({
  imports: [],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
