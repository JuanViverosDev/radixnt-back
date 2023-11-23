import { AttachmentsV2Service } from "./attachments-v2.service";
import { AttachmentV2 } from "./entities/attachment-v2.entity";
import { UtilsService } from "../utils/utils.service";
export declare class AttachmentsV2Controller {
    private readonly attachmentService;
    private readonly utilsService;
    constructor(attachmentService: AttachmentsV2Service, utilsService: UtilsService);
    saveAttachments(requestId: string, attachments: AttachmentV2[]): Promise<void | {
        success: boolean;
        data: AttachmentV2[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAttachments(requestId: string): Promise<void | {
        success: boolean;
        data: AttachmentV2[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    paginate(requestId: string, attachments: AttachmentV2[]): Promise<void | {
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
}
