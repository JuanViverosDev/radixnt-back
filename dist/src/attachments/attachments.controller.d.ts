import { responseDto } from 'src/utils/dto/response.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from 'src/utils/utils.service';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
export declare class AttachmentsController {
    private readonly attachmentService;
    private readonly utilsService;
    constructor(attachmentService: AttachmentsService, utilsService: UtilsService);
    createAttach(createAttachmentDto: CreateAttachmentDto): Promise<void | responseDto>;
    updateCommunication(param: ParamUuidDto, updateAttachmentDto: UpdateAttachmentDto): Promise<void | responseDto>;
    getAttachmentRequest(param: ParamUuidDto): Promise<void | responseDto>;
    getListtypes(): Promise<void | responseDto>;
}
