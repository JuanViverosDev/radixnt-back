import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AttachmentsV2Service} from "./attachments-v2.service";
import {AttachmentV2} from "./entities/attachment-v2.entity";
import {UtilsService} from "../utils/utils.service";

@Controller('attachments-v2')
export class AttachmentsV2Controller {
  constructor(
    private readonly attachmentService: AttachmentsV2Service,
    private readonly utilsService: UtilsService,
  ) {
  }

  @Post('/:requestId')
  async saveAttachments(@Param('requestId') requestId: string, @Body() attachments: AttachmentV2[]) {
    const response = await this.attachmentService.saveAttachments(requestId, attachments);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('/:requestId')
  async getAttachments(@Param('requestId') requestId: string) {
    const response = await this.attachmentService.getAttachments(requestId);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('/paginate/:requestId')
  async paginate(@Param('requestId') requestId: string, @Body() attachments: AttachmentV2[]) {
    const response = await this.attachmentService.paginate(requestId, attachments);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }
}
