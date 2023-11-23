import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateTypeReqDto } from './dto/create-typereq.dto';
import { UpdateTypeReqDto } from './dto/update-typereq.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { CreateProcessStateDto } from './dto/create-processState.dto';
import { UpdateProcessStateDto } from './dto/update-processState.dto';
import { CreateCommunicationDto } from './dto/create-typecommunication.dto';
import { UpdateCommunicationDto } from './dto/update-typecommunication.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { responseDto } from 'src/utils/dto/response.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { FirebaseAuthGuard } from 'src/auth/auth.guard';
import { SearchDocumentDto } from './dto/search-document.dto';
import { SetGlobalConfigDto } from './dto/set-global-config.dto';
import { ModifyExpireDateDto } from './dto/modify-expire-date.dto';
import { PaginateDto } from './dto/paginate.dto';
import { NotifyDisciplinedDto } from './dto/notifyDisciplined.dto';
import { NotifyOrCommunicateDto } from './dto/notify-or-communicate.dto';
import { AttachVoucherDto } from './dto/attach-voucher.dto';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly utilsService: UtilsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('request')
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() createRequestDto: CreateRequestDto) {
    const response: responseDto = await this.requestsService.create(
      createRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('request')
  @UseGuards(FirebaseAuthGuard)
  async findAll(@Req() req) {
    const response: responseDto = await this.requestsService.findAll();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('requestbyuser/:id')
  @UseGuards(FirebaseAuthGuard)
  async findRequestByUser(@Req() req, @Param() param: ParamUuidDto) {
    const { user_id } = req.user;
    const userResponse = await this.usersService.getUserByFireBaseUUID(user_id);
    if (!userResponse.success) this.utilsService.handleError(userResponse);

    if (
      userResponse.data.userRole.roleName == 'Director de Instruccion' ||
      userResponse.data.roles.some(
        (role) => role.roleName == 'Director de Instruccion',
      )
    ) {
      const response: responseDto = await this.requestsService.findAll();
      if (!response.success) return this.utilsService.handleError(response);
      return response;
    } else {
      const response: responseDto =
        await this.requestsService.findRequestByUser(userResponse.data.id);
      if (!response.success) return this.utilsService.handleError(response);
      return response;
    }
  }

  @Get('request/:id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(@Param() param: ParamUuidDto) {
    const response: responseDto = await this.requestsService.findOne(param.id);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Patch('request/:id')
  @UseGuards(FirebaseAuthGuard)
  async update(
    @Param() param: ParamUuidDto,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    const userAssing = await this.usersService.getUserById(
      updateRequestDto.userAgentSelected,
    );

    //if(!userAssing.success) return await this.utilsService.handleError({ success: false, code: 'CD002' });
    updateRequestDto.agentSelected = userAssing.data;

    const response: responseDto = await this.requestsService.update(
      param.id,
      updateRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('createtyperequest')
  @UseGuards(FirebaseAuthGuard)
  async createTypeReq(@Body() createRequestDto: CreateTypeReqDto) {
    const response: responseDto = await this.requestsService.createTypeReq(
      createRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('typerequest')
  @UseGuards(FirebaseAuthGuard)
  async findAllTypeReq() {
    const response: responseDto = await this.requestsService.findAllTypeReq();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Patch('modifytyperequest/:id')
  @UseGuards(FirebaseAuthGuard)
  async updateTypeReq(
    @Param() param: ParamUuidDto,
    @Body() updateRequestDto: UpdateTypeReqDto,
  ) {
    const response: responseDto = await this.requestsService.ModifyTypeReq(
      param.id,
      updateRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('createstateprocess')
  @UseGuards(FirebaseAuthGuard)
  async createProcessState(@Body() createRequestDto: CreateProcessStateDto) {
    const response: responseDto = await this.requestsService.createProcessState(
      createRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('stateprocess')
  @UseGuards(FirebaseAuthGuard)
  async findAllProcessState() {
    const response: responseDto =
      await this.requestsService.findAllProcessState();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Patch('modifystateprocess/:id')
  @UseGuards(FirebaseAuthGuard)
  async updateProcessState(
    @Param() param: ParamUuidDto,
    @Body() updateRequestDto: UpdateProcessStateDto,
  ) {
    const response: responseDto = await this.requestsService.ModifyProcessState(
      param.id,
      updateRequestDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('createcommunication')
  @UseGuards(FirebaseAuthGuard)
  async createCommunication(@Body() createRequestDto: CreateCommunicationDto) {
    const response: responseDto =
      await this.requestsService.createCommunication(createRequestDto);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('communication')
  @UseGuards(FirebaseAuthGuard)
  async findAllCommunication() {
    const response: responseDto =
      await this.requestsService.findAllCommunication();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Patch('modifycommunication/:id')
  @UseGuards(FirebaseAuthGuard)
  async updateCommunication(
    @Param() param: ParamUuidDto,
    @Body() updateRequestDto: UpdateCommunicationDto,
  ) {
    const response: responseDto =
      await this.requestsService.ModifyCommunication(
        param.id,
        updateRequestDto,
      );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('documents')
  @UseGuards(FirebaseAuthGuard)
  async uploadDocument(@Body() uploadDocumentDto: UploadDocumentDto) {
    const response: responseDto = await this.requestsService.uploadDocument(
      uploadDocumentDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('documents/:requestId/:stage')
  @UseGuards(FirebaseAuthGuard)
  async getDocuments(
    @Param('requestId') requestId: string,
    @Param('stage') stage: string,
  ) {
    const response: responseDto = await this.requestsService.getDocuments(
      requestId,
      stage,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('documentsall/:requestId')
  // @UseGuards(FirebaseAuthGuard)
  async getDocumentsByRequest(@Param('requestId') requestId: string) {
    const response: responseDto =
      await this.requestsService.getAllDocumentsByRequestV2(requestId);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('generateproceedingsnumber')
  @UseGuards(FirebaseAuthGuard)
  async generateProceedingsNumber() {
    const response: responseDto =
      await this.requestsService.generateProceedingsNumberV2();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('allproceedingsnumbers')
  @UseGuards(FirebaseAuthGuard)
  async getAllProceedingsNumber() {
    const response: responseDto =
      await this.requestsService.getAllProceedingsNumber();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('testingstage')
  async testStage(
    @Body('requestId') requestId: string,
    @Body('stageId') stageId: number,
  ) {
    await this.requestsService.changeRequestStage(requestId, stageId);
  }

  @Post('testingassign')
  async testAssign(
    @Body('requestId') requestId: string,
    @Body('roleName') roleName: string,
  ) {
    await this.requestsService.assignRequestToRole(requestId, roleName);
  }

  @Get('requestbyproceedingsnumber/:proceedingsnumber')
  @UseGuards(FirebaseAuthGuard)
  async getRequestByProceedingsNumber(
    @Param('proceedingsnumber') proceedingsNumber: string,
  ) {
    const response: responseDto =
      await this.requestsService.getRequestByProceedingsNumber(
        proceedingsNumber,
      );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('searchdocument')
  @UseGuards(FirebaseAuthGuard)
  async searchDocument(@Body() searchDocumentDto: SearchDocumentDto) {
    const response: responseDto = await this.requestsService.searchDocument(
      searchDocumentDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('setglobalconfig')
  @UseGuards(FirebaseAuthGuard)
  async setGlobalConfig(@Body() setGlobalConfigDto: SetGlobalConfigDto) {
    const response: responseDto = await this.requestsService.setGlobalConfig(
      setGlobalConfigDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('setglobalconfig')
  @UseGuards(FirebaseAuthGuard)
  async getGlobalConfig() {
    const response: responseDto = await this.requestsService.getGlobalConfig();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('states')
  @UseGuards(FirebaseAuthGuard)
  async getAllRequestStates() {
    const response: responseDto =
      await this.requestsService.getAllRequestStates();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('states')
  @UseGuards(FirebaseAuthGuard)
  async modifyState(@Body() modifyExpireDateDto: ModifyExpireDateDto) {
    const response: responseDto = await this.requestsService.modifyRequestState(
      modifyExpireDateDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('paginate')
  @UseGuards(FirebaseAuthGuard)
  async paginate(@Body() paginate: PaginateDto) {
    const response: responseDto = await this.requestsService.paginate(paginate);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('dashboard')
  @UseGuards(FirebaseAuthGuard)
  async dashboard() {
    const response: responseDto = await this.requestsService.dashboard();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('stages')
  @UseGuards(FirebaseAuthGuard)
  async getAllRequestStages() {
    const response: responseDto =
      await this.requestsService.getAllRequestStages();
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('folio/:requestId')
  @UseGuards(FirebaseAuthGuard)
  async getFolio(@Param('requestId') requestId: string) {
    const response: responseDto = await this.requestsService.getFolio(
      requestId,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('email')
  async email() {
    await this.requestsService.testEmail();
  }

  @Get('variablesfortemplate/:templateId')
  //@UseGuards(FirebaseAuthGuard)
  async getVariablesForTemplate(@Param('templateId') templateId: number) {
    const response: responseDto =
      await this.requestsService.getVariablesForTemplate(templateId);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('notifydisciplined')
  // @UseGuards(FirebaseAuthGuard)
  async notifyDisciplined(@Body() notifyDisciplinedDto: NotifyDisciplinedDto) {
    const response: responseDto = await this.requestsService.notifyDisciplined(
      notifyDisciplinedDto,
    );
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Get('test-sms/:phoneNumber')
  async testSMS(@Param('phoneNumber') phoneNumber: string) {
    await this.requestsService.testSms(phoneNumber);
  }

  @Get('pendingtonotify')
  async pendingToNotify() {
    return await this.requestsService.pendingToNotify();
  }

  @Get('notificationspanel')
  async notificationsPanel() {
    return {
      pending: await this.requestsService.pendingToNotify(),
      inProgressOrCompleted: await this.requestsService.communicatedOrNotified()
    }
  }

  @Get('pendingtonotify/:title')
  async pendingToNotifyByTitle(@Param('title') title: string) {
    return await this.requestsService.pendingToNotifyByTitle(title);
  }

  @Get('communicatedornotified/:title')
  async communicatedOrNotifiedByTitle(@Param('title') title: string) {
    return await this.requestsService.communicatedOrNotifiedByTitle(title);
  }

  @Post('notifyorcommunicatewithemail')
  async notifyOrCommunicate(
    @Body() notifyOrCommunicateDto: NotifyOrCommunicateDto,
  ) {
    const response: responseDto =
      await this.requestsService.notifyOrCommunicateWithEmail(notifyOrCommunicateDto);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }

  @Post('attachvoucher/:requestId')
  async attachVoucher(@Param('requestId') requestId: string, @Body() data: AttachVoucherDto) {
    const response: responseDto =
      await this.requestsService.attachVoucher(requestId, data);
    if (!response.success) return this.utilsService.handleError(response);
    return response;
  }
}
