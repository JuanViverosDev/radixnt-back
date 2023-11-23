import { RequestHeader } from "../../requests/entities/request.entity";
export declare class AttachmentV2 {
    s3Key: string;
    filename: string;
    fileType: string;
    request?: RequestHeader | string;
    createdAt: Date;
    updatedAt: Date;
}
