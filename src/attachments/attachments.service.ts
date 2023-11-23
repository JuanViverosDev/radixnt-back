import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { RequestHeader } from 'src/requests/entities/request.entity';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { Attachment } from './entities/attachment.entity';
import { AttachmentType } from './entities/attachmentType.entity';

@Injectable()
export class AttachmentsService {
    constructor(
        @InjectRepository(Attachment)
        private readonly repositoryAttachment: Repository<Attachment>,
        @InjectRepository(AttachmentType)
        private readonly repositoryAttachmentType: Repository<AttachmentType>,
        @InjectRepository(RequestHeader)
        private readonly repositoryRequestHeader: Repository<RequestHeader>,
      ) {}

    async createAttachment(createAttach:CreateAttachmentDto ){
        try{
            const currentType = await this.repositoryAttachmentType.findOne({where: { id : createAttach.id_attachType}})
            const currentRequest = await this.repositoryRequestHeader.findOne({where: { id : createAttach.id_requestHeader}})
            
            if (!currentType || !currentRequest) {
                return {
                  success: false,
                  code: 'CD002',
                };
              }

            createAttach.attachType = currentType;
            createAttach.requestHeader  = currentRequest;
            const newAttach =  await this.repositoryAttachment.save(createAttach);

            return {
                success: true,
                data: plainToInstance(Attachment, newAttach),
              };
        } catch (error) {
            return {
              success: false,
              message: error.message,
            };
          }
        
    }

    async ModifyAttachment(id:string, updateAttachmentDto: UpdateAttachmentDto){
      try{
        const currentAttach = await this.repositoryAttachment.findOne({
          where: { id: id },
        });

        if(updateAttachmentDto.attachmentName) currentAttach.fileName = updateAttachmentDto.attachmentName;
        if(updateAttachmentDto.base64) currentAttach.base64 = updateAttachmentDto.base64;
        if(updateAttachmentDto.id_attachType){
          const curretType = await this.repositoryAttachmentType.findOne({ where: {id: updateAttachmentDto.id_attachType }})
          if(curretType) currentAttach.attachType = curretType;
        }
        if(updateAttachmentDto.id_requestHeader){
          const curretHeader = await this.repositoryRequestHeader.findOne({ where: {id: updateAttachmentDto.id_requestHeader }})
          if(curretHeader) currentAttach.requestHeader = curretHeader;
        }

        if(updateAttachmentDto.attachState !== undefined) currentAttach.attachState = updateAttachmentDto.attachState;
    
        const modifyAttach = await this.repositoryAttachment.save(currentAttach);
      return {
        success: true,
        data: plainToInstance(Attachment, modifyAttach),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
    }

    async getAttachmentRequest(id:string){
      try {
        const currentAttach = await this.repositoryAttachment.find({
          where: {
            requestHeader: { id: id},
          },
        });
  
        if (currentAttach) {
          return {
            success: true,
            data: plainToInstance(Attachment, currentAttach),
          };
        } else {
          return {
            success: false,
            code: 'CD001',
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    async getListtypes(){
      try {
        const currentAttach = await this.repositoryAttachmentType.find({
          where:{ stateAttachmentType : true}
        });
  
        if (currentAttach) {
          return {
            success: true,
            data: plainToInstance(Attachment, currentAttach),
          };
        } else {
          return {
            success: true,
            data: []
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }
}
