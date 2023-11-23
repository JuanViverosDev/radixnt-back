import {Injectable} from '@nestjs/common';
import {AttachmentV2} from "./entities/attachment-v2.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RequestsService} from "../requests/requests.service";
import {InjectS3, S3} from "nestjs-s3";
import {ConfigService} from "@nestjs/config";
import {RequestHeader} from "../requests/entities/request.entity";

@Injectable()
export class AttachmentsV2Service {
  constructor(
    @InjectRepository(AttachmentV2)
    private readonly attachmentv2Repository: Repository<AttachmentV2>,
    @InjectS3()
    private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {
  }

  async saveAttachments(requestId: string, attachments: AttachmentV2[]) {
    try {
      attachments.forEach(att => {
        return {
          ...att,
          request: requestId
        }
      });

      return {
        success: true,
        data: await this.attachmentv2Repository.save(attachments)
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }

  async getAttachments(requestId: string) {
    try {
      const attachments = await this.attachmentv2Repository.find({
        where: {
          request: {
            id: requestId
          }
        }
      })
      return {
        success: true,
        data: attachments
      }
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }

  async paginate(requestId: string, attachments: AttachmentV2[]) {
    try {
      const request: RequestHeader = (await this.attachmentv2Repository.findOne({
        where: {
          s3Key: attachments[0].s3Key
        },
        relations: ['request']
      })).request as RequestHeader

      const objects = await this.s3.getObject({
        Bucket: this.configService.get('AWS_BUCKET'),
        Key: request.s3Folder
      }).promise();

      //TODO
      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }
}
