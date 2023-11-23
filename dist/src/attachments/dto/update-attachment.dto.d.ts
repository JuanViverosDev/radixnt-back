import { RequestHeader } from 'src/requests/entities/request.entity';
import { AttachmentType } from '../entities/attachmentType.entity';
export declare class UpdateAttachmentDto {
    attachmentName: string;
    base64: string;
    id_attachType: string;
    attachType: AttachmentType;
    id_requestHeader: string;
    requestHeader: RequestHeader;
    attachState: boolean;
}
