import { Module } from '@nestjs/common';
import { AttachmentsV2Service } from './attachments-v2.service';
import {S3Module} from "nestjs-s3";
import {ConfigService} from "@nestjs/config";
import { AttachmentsV2Controller } from './attachments-v2.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AttachmentV2} from "./entities/attachment-v2.entity";

@Module({
  providers: [AttachmentsV2Service, ConfigService],
  imports: [
    TypeOrmModule.forFeature([AttachmentV2]),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            credentials: {
              accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
              secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
            },
            region: configService.get('AWS_REGION')
          }
        }
      }
    })
  ],
  controllers: [AttachmentsV2Controller]
})
export class AttachmentsV2Module {}
