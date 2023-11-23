import { RequestHeader } from 'src/requests/entities/request.entity';
import { AttachmentType } from '../entities/attachmentType.entity';
export declare class CreateAttachmentDto {
    attachmentName: string;
    base64: string;
    id_attachType: string;
    id_requestHeader: string;
    requestHeader: RequestHeader;
    attachType: AttachmentType;
}
