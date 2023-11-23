import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SnsModule } from '@vetsmm/nestjs-sns';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';

@Module({
  controllers: [NotificationsController],
  exports: [NotificationsService],
  imports: [
    SnsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        region: configService.get('AWS_REGION'),
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      }),
    }),
    TypeOrmModule.forFeature([EmailTemplate]),
  ],
  providers: [NotificationsService]
})
export class NotificationsModule {}
