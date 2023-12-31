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
exports.AttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const uuid_dto_1 = require("../utils/dto/uuid.dto");
const utils_service_1 = require("../utils/utils.service");
const attachments_service_1 = require("./attachments.service");
const create_attachment_dto_1 = require("./dto/create-attachment.dto");
const update_attachment_dto_1 = require("./dto/update-attachment.dto");
let AttachmentsController = class AttachmentsController {
    constructor(attachmentService, utilsService) {
        this.attachmentService = attachmentService;
        this.utilsService = utilsService;
    }
    async createAttach(createAttachmentDto) {
        const response = await this.attachmentService.createAttachment(createAttachmentDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async updateCommunication(param, updateAttachmentDto) {
        const response = await this.attachmentService.ModifyAttachment(param.id, updateAttachmentDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async getAttachmentRequest(param) {
        const response = await this.attachmentService.getAttachmentRequest(param.id);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async getListtypes() {
        const response = await this.attachmentService.getListtypes();
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Post)('createattach'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attachment_dto_1.CreateAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "createAttach", null);
__decorate([
    (0, common_1.Patch)('updateattachment/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto, update_attachment_dto_1.UpdateAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "updateCommunication", null);
__decorate([
    (0, common_1.Get)('attachmentbyrequest/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "getAttachmentRequest", null);
__decorate([
    (0, common_1.Get)('listtypes'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "getListtypes", null);
AttachmentsController = __decorate([
    (0, common_1.Controller)('attachments'),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService,
        utils_service_1.UtilsService])
], AttachmentsController);
exports.AttachmentsController = AttachmentsController;
//# sourceMappingURL=attachments.controller.js.map