import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { AttachmentType } from './entities/attachmentType.entity';
import { RequestHeader } from 'src/requests/entities/request.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Attachment, AttachmentType, RequestHeader]),
   ], 
   providers: [AttachmentsService],
  controllers: [AttachmentsController]
})
export class AttachmentsModule {}
