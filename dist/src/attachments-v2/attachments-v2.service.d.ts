import { AttachmentV2 } from "./entities/attachment-v2.entity";
import { Repository } from "typeorm";
import { S3 } from "nestjs-s3";
import { ConfigService } from "@nestjs/config";
export declare class AttachmentsV2Service {
    private readonly attachmentv2Repository;
    private readonly s3;
    private readonly configService;
    constructor(attachmentv2Repository: Repository<AttachmentV2>, s3: S3, configService: ConfigService);
    saveAttachments(requestId: string, attachments: AttachmentV2[]): Promise<{
        success: boolean;
        data: AttachmentV2[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAttachments(requestId: string): Promise<{
        success: boolean;
        data: AttachmentV2[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    paginate(requestId: string, attachments: AttachmentV2[]): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
}
