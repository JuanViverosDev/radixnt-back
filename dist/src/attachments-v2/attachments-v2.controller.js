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
exports.AttachmentsV2Controller = void 0;
const common_1 = require("@nestjs/common");
const attachments_v2_service_1 = require("./attachments-v2.service");
const utils_service_1 = require("../utils/utils.service");
let AttachmentsV2Controller = class AttachmentsV2Controller {
    constructor(attachmentService, utilsService) {
        this.attachmentService = attachmentService;
        this.utilsService = utilsService;
    }
    async saveAttachments(requestId, attachments) {
        const response = await this.attachmentService.saveAttachments(requestId, attachments);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async getAttachments(requestId) {
        const response = await this.attachmentService.getAttachments(requestId);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async paginate(requestId, attachments) {
        const response = await this.attachmentService.paginate(requestId, attachments);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Post)('/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AttachmentsV2Controller.prototype, "saveAttachments", null);
__decorate([
    (0, common_1.Get)('/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttachmentsV2Controller.prototype, "getAttachments", null);
__decorate([
    (0, common_1.Post)('/paginate/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AttachmentsV2Controller.prototype, "paginate", null);
AttachmentsV2Controller = __decorate([
    (0, common_1.Controller)('attachments-v2'),
    __metadata("design:paramtypes", [attachments_v2_service_1.AttachmentsV2Service,
        utils_service_1.UtilsService])
], AttachmentsV2Controller);
exports.AttachmentsV2Controller = AttachmentsV2Controller;
//# sourceMappingURL=attachments-v2.controller.js.map