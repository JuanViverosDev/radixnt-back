import { RequestHeader } from 'src/requests/entities/request.entity';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { Attachment } from './entities/attachment.entity';
import { AttachmentType } from './entities/attachmentType.entity';
export declare class AttachmentsService {
    private readonly repositoryAttachment;
    private readonly repositoryAttachmentType;
    private readonly repositoryRequestHeader;
    constructor(repositoryAttachment: Repository<Attachment>, repositoryAttachmentType: Repository<AttachmentType>, repositoryRequestHeader: Repository<RequestHeader>);
    createAttachment(createAttach: CreateAttachmentDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Attachment;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    ModifyAttachment(id: string, updateAttachmentDto: UpdateAttachmentDto): Promise<{
        success: boolean;
        data: Attachment;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAttachmentRequest(id: string): Promise<{
        success: boolean;
        data: Attachment[];
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
        code?: undefined;
    }>;
    getListtypes(): Promise<{
        success: boolean;
        data: Attachment[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
