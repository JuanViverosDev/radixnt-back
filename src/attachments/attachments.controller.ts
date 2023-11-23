import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/auth.guard';
import { responseDto } from 'src/utils/dto/response.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from 'src/utils/utils.service';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
    constructor(
        private readonly attachmentService : AttachmentsService,
        private readonly utilsService : UtilsService
    ){}

    @Post('createattach')
    @UseGuards(FirebaseAuthGuard)
    async createAttach(@Body() createAttachmentDto : CreateAttachmentDto){
        const response : responseDto = await this.attachmentService.createAttachment(createAttachmentDto);
        if(!response.success) return await this.utilsService.handleError(response);
        return response;
    }

    @Patch('updateattachment/:id')
    @UseGuards(FirebaseAuthGuard)
    async updateCommunication(@Param() param: ParamUuidDto, @Body() updateAttachmentDto: UpdateAttachmentDto) {
        const response : responseDto = await this.attachmentService.ModifyAttachment(param.id, updateAttachmentDto);
        if(!response.success) return await this.utilsService.handleError(response);
        return response;
    }

    @Get('attachmentbyrequest/:id')
    @UseGuards(FirebaseAuthGuard)
    async getAttachmentRequest(@Param() param: ParamUuidDto) {
        const response : responseDto = await this.attachmentService.getAttachmentRequest(param.id);
        if(!response.success) return await this.utilsService.handleError(response);
        return response;
    }

    @Get('listtypes')
    @UseGuards(FirebaseAuthGuard)
    async getListtypes() {
        const response : responseDto = await this.attachmentService.getListtypes();
        if(!response.success) return await this.utilsService.handleError(response);
        return response;
    }

}
