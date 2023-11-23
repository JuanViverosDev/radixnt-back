import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RequestsModule } from './requests/requests.module';
import { ConfigRequestModule } from './config-request/config-request.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { TemplatesModule } from './templates/templates.module';
import { FirebaseAuthStrategy } from './auth/auth.strategy';
import { AttachmentsV2Module } from './attachments-v2/attachments-v2.module';
import {ScheduleModule} from "@nestjs/schedule";
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UtilsModule,
    UsersModule,
    DatabaseModule,
    RequestsModule,
    ConfigRequestModule,
    AttachmentsModule,
    TemplatesModule,
    AttachmentsV2Module,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy],
})
export class AppModule {}
