import { AttachmentType } from './attachmentType.entity';
import { RequestHeader } from '../../requests/entities/request.entity';
export declare class Attachment {
    id: string;
    fileName: string;
    base64: string;
    attachType: AttachmentType;
    attachState: boolean;
    fileType: string;
    requestHeader: RequestHeader;
    createdAt: Date;
    updatedAt: Date;
    documentType?: string;
}
