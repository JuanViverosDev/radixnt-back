// import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { RequestHeader } from 'src/requests/entities/request.entity';
import { AttachmentType } from '../entities/attachmentType.entity';

export class CreateAttachmentDto { 
    @IsNotEmpty()
    attachmentName: string;
    @IsNotEmpty()
    base64: string;
    @IsNotEmpty()
    id_attachType: string;
    @IsNotEmpty()
    id_requestHeader: string;
    
    @IsOptional()
    @IsNotEmpty()
    requestHeader: RequestHeader;
    @IsOptional()
    @IsNotEmpty()
    attachType: AttachmentType;
}


