// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { RequestHeader } from 'src/requests/entities/request.entity';
import { AttachmentType } from '../entities/attachmentType.entity';

export class UpdateAttachmentDto { 
    @IsOptional()
    @IsNotEmpty()
    attachmentName: string;
    @IsOptional()
    @IsNotEmpty()
    base64: string;
    @IsOptional()
    @IsNotEmpty()
    id_attachType: string;
    @IsOptional()
    @IsNotEmpty()
    attachType: AttachmentType;
    @IsOptional()
    @IsNotEmpty()
    id_requestHeader: string;

    @IsOptional()
    @IsNotEmpty()
    requestHeader: RequestHeader;
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    attachState: boolean;
}




