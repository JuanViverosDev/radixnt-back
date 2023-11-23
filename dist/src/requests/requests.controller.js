"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_dto_1 = require("./dto/update-request.dto");
const create_typereq_dto_1 = require("./dto/create-typereq.dto");
const update_typereq_dto_1 = require("./dto/update-typereq.dto");
const uuid_dto_1 = require("../utils/dto/uuid.dto");
const create_processState_dto_1 = require("./dto/create-processState.dto");
const update_processState_dto_1 = require("./dto/update-processState.dto");
const create_typecommunication_dto_1 = require("./dto/create-typecommunication.dto");
const update_typecommunication_dto_1 = require("./dto/update-typecommunication.dto");
const upload_document_dto_1 = require("./dto/upload-document.dto");
const utils_service_1 = require("../utils/utils.service");
const users_service_1 = require("../users/users.service");
const auth_guard_1 = require("../auth/auth.guard");
const search_document_dto_1 = require("./dto/search-document.dto");
const set_global_config_dto_1 = require("./dto/set-global-config.dto");
const modify_expire_date_dto_1 = require("./dto/modify-expire-date.dto");
const paginate_dto_1 = require("./dto/paginate.dto");
const notifyDisciplined_dto_1 = require("./dto/notifyDisciplined.dto");
const notify_or_communicate_dto_1 = require("./dto/notify-or-communicate.dto");
const attach_voucher_dto_1 = require("./dto/attach-voucher.dto");
let RequestsController = class RequestsController {
    constructor(requestsService, utilsService, usersService) {
        this.requestsService = requestsService;
        this.utilsService = utilsService;
        this.usersService = usersService;
    }
    async create(createRequestDto) {
        const response = await this.requestsService.create(createRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async findAll(req) {
        const response = await this.requestsService.findAll();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async findRequestByUser(req, param) {
        const { user_id } = req.user;
        const userResponse = await this.usersService.getUserByFireBaseUUID(user_id);
        if (!userResponse.success)
            this.utilsService.handleError(userResponse);
        if (userResponse.data.userRole.roleName == 'Director de Instruccion' ||
            userResponse.data.roles.some((role) => role.roleName == 'Director de Instruccion')) {
            const response = await this.requestsService.findAll();
            if (!response.success)
                return this.utilsService.handleError(response);
            return response;
        }
        else {
            const response = await this.requestsService.findRequestByUser(userResponse.data.id);
            if (!response.success)
                return this.utilsService.handleError(response);
            return response;
        }
    }
    async findOne(param) {
        const response = await this.requestsService.findOne(param.id);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async update(param, updateRequestDto) {
        const userAssing = await this.usersService.getUserById(updateRequestDto.userAgentSelected);
        updateRequestDto.agentSelected = userAssing.data;
        const response = await this.requestsService.update(param.id, updateRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async createTypeReq(createRequestDto) {
        const response = await this.requestsService.createTypeReq(createRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async findAllTypeReq() {
        const response = await this.requestsService.findAllTypeReq();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async updateTypeReq(param, updateRequestDto) {
        const response = await this.requestsService.ModifyTypeReq(param.id, updateRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async createProcessState(createRequestDto) {
        const response = await this.requestsService.createProcessState(createRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async findAllProcessState() {
        const response = await this.requestsService.findAllProcessState();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async updateProcessState(param, updateRequestDto) {
        const response = await this.requestsService.ModifyProcessState(param.id, updateRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async createCommunication(createRequestDto) {
        const response = await this.requestsService.createCommunication(createRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async findAllCommunication() {
        const response = await this.requestsService.findAllCommunication();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async updateCommunication(param, updateRequestDto) {
        const response = await this.requestsService.ModifyCommunication(param.id, updateRequestDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async uploadDocument(uploadDocumentDto) {
        const response = await this.requestsService.uploadDocument(uploadDocumentDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getDocuments(requestId, stage) {
        const response = await this.requestsService.getDocuments(requestId, stage);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getDocumentsByRequest(requestId) {
        const response = await this.requestsService.getAllDocumentsByRequestV2(requestId);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async generateProceedingsNumber() {
        const response = await this.requestsService.generateProceedingsNumberV2();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getAllProceedingsNumber() {
        const response = await this.requestsService.getAllProceedingsNumber();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async testStage(requestId, stageId) {
        await this.requestsService.changeRequestStage(requestId, stageId);
    }
    async testAssign(requestId, roleName) {
        await this.requestsService.assignRequestToRole(requestId, roleName);
    }
    async getRequestByProceedingsNumber(proceedingsNumber) {
        const response = await this.requestsService.getRequestByProceedingsNumber(proceedingsNumber);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async searchDocument(searchDocumentDto) {
        const response = await this.requestsService.searchDocument(searchDocumentDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async setGlobalConfig(setGlobalConfigDto) {
        const response = await this.requestsService.setGlobalConfig(setGlobalConfigDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getGlobalConfig() {
        const response = await this.requestsService.getGlobalConfig();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getAllRequestStates() {
        const response = await this.requestsService.getAllRequestStates();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async modifyState(modifyExpireDateDto) {
        const response = await this.requestsService.modifyRequestState(modifyExpireDateDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async paginate(paginate) {
        const response = await this.requestsService.paginate(paginate);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async dashboard() {
        const response = await this.requestsService.dashboard();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getAllRequestStages() {
        const response = await this.requestsService.getAllRequestStages();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getFolio(requestId) {
        const response = await this.requestsService.getFolio(requestId);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async email() {
        await this.requestsService.testEmail();
    }
    async getVariablesForTemplate(templateId) {
        const response = await this.requestsService.getVariablesForTemplate(templateId);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async notifyDisciplined(notifyDisciplinedDto) {
        const response = await this.requestsService.notifyDisciplined(notifyDisciplinedDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async testSMS(phoneNumber) {
        await this.requestsService.testSms(phoneNumber);
    }
    async pendingToNotify() {
        return await this.requestsService.pendingToNotify();
    }
    async notificationsPanel() {
        return {
            pending: await this.requestsService.pendingToNotify(),
            inProgressOrCompleted: await this.requestsService.communicatedOrNotified()
        };
    }
    async pendingToNotifyByTitle(title) {
        return await this.requestsService.pendingToNotifyByTitle(title);
    }
    async communicatedOrNotifiedByTitle(title) {
        return await this.requestsService.communicatedOrNotifiedByTitle(title);
    }
    async notifyOrCommunicate(notifyOrCommunicateDto) {
        const response = await this.requestsService.notifyOrCommunicateWithEmail(notifyOrCommunicateDto);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async attachVoucher(requestId, data) {
        const response = await this.requestsService.attachVoucher(requestId, data);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Post)('request'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('request'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('requestbyuser/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, uuid_dto_1.ParamUuidDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findRequestByUser", null);
__decorate([
    (0, common_1.Get)('request/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('request/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_request_dto_1.UpdateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('createtyperequest'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_typereq_dto_1.CreateTypeReqDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createTypeReq", null);
__decorate([
    (0, common_1.Get)('typerequest'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAllTypeReq", null);
__decorate([
    (0, common_1.Patch)('modifytyperequest/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_typereq_dto_1.UpdateTypeReqDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateTypeReq", null);
__decorate([
    (0, common_1.Post)('createstateprocess'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_processState_dto_1.CreateProcessStateDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createProcessState", null);
__decorate([
    (0, common_1.Get)('stateprocess'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAllProcessState", null);
__decorate([
    (0, common_1.Patch)('modifystateprocess/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_processState_dto_1.UpdateProcessStateDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateProcessState", null);
__decorate([
    (0, common_1.Post)('createcommunication'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_typecommunication_dto_1.CreateCommunicationDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createCommunication", null);
__decorate([
    (0, common_1.Get)('communication'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAllCommunication", null);
__decorate([
    (0, common_1.Patch)('modifycommunication/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_typecommunication_dto_1.UpdateCommunicationDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateCommunication", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_document_dto_1.UploadDocumentDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents/:requestId/:stage'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Param)('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Get)('documentsall/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getDocumentsByRequest", null);
__decorate([
    (0, common_1.Get)('generateproceedingsnumber'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "generateProceedingsNumber", null);
__decorate([
    (0, common_1.Get)('allproceedingsnumbers'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAllProceedingsNumber", null);
__decorate([
    (0, common_1.Post)('testingstage'),
    __param(0, (0, common_1.Body)('requestId')),
    __param(1, (0, common_1.Body)('stageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "testStage", null);
__decorate([
    (0, common_1.Post)('testingassign'),
    __param(0, (0, common_1.Body)('requestId')),
    __param(1, (0, common_1.Body)('roleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "testAssign", null);
__decorate([
    (0, common_1.Get)('requestbyproceedingsnumber/:proceedingsnumber'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('proceedingsnumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequestByProceedingsNumber", null);
__decorate([
    (0, common_1.Post)('searchdocument'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_document_dto_1.SearchDocumentDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "searchDocument", null);
__decorate([
    (0, common_1.Post)('setglobalconfig'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_global_config_dto_1.SetGlobalConfigDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "setGlobalConfig", null);
__decorate([
    (0, common_1.Get)('setglobalconfig'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getGlobalConfig", null);
__decorate([
    (0, common_1.Get)('states'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAllRequestStates", null);
__decorate([
    (0, common_1.Post)('states'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modify_expire_date_dto_1.ModifyExpireDateDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "modifyState", null);
__decorate([
    (0, common_1.Post)('paginate'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginate_dto_1.PaginateDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "paginate", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('stages'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAllRequestStages", null);
__decorate([
    (0, common_1.Get)('folio/:requestId'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getFolio", null);
__decorate([
    (0, common_1.Get)('email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "email", null);
__decorate([
    (0, common_1.Get)('variablesfortemplate/:templateId'),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getVariablesForTemplate", null);
__decorate([
    (0, common_1.Post)('notifydisciplined'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifyDisciplined_dto_1.NotifyDisciplinedDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "notifyDisciplined", null);
__decorate([
    (0, common_1.Get)('test-sms/:phoneNumber'),
    __param(0, (0, common_1.Param)('phoneNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "testSMS", null);
__decorate([
    (0, common_1.Get)('pendingtonotify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "pendingToNotify", null);
__decorate([
    (0, common_1.Get)('notificationspanel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "notificationsPanel", null);
__decorate([
    (0, common_1.Get)('pendingtonotify/:title'),
    __param(0, (0, common_1.Param)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "pendingToNotifyByTitle", null);
__decorate([
    (0, common_1.Get)('communicatedornotified/:title'),
    __param(0, (0, common_1.Param)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "communicatedOrNotifiedByTitle", null);
__decorate([
    (0, common_1.Post)('notifyorcommunicatewithemail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notify_or_communicate_dto_1.NotifyOrCommunicateDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "notifyOrCommunicate", null);
__decorate([
    (0, common_1.Post)('attachvoucher/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attach_voucher_dto_1.AttachVoucherDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "attachVoucher", null);
RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        utils_service_1.UtilsService,
        users_service_1.UsersService])
], RequestsController);
exports.RequestsController = RequestsController;
//# sourceMappingURL=requests.controller.js.map