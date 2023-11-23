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
exports.ConfigRequestController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const uuid_dto_1 = require("../utils/dto/uuid.dto");
const utils_service_1 = require("../utils/utils.service");
const config_request_service_1 = require("./config-request.service");
const create_lawyers_dto_1 = require("./dto/create-lawyers.dto");
const create_typefile_dto_1 = require("./dto/create-typefile.dto");
const update_lawyers_dto_1 = require("./dto/update-lawyers.dto");
const update_typefile_dto_1 = require("./dto/update-typefile.dto");
let ConfigRequestController = class ConfigRequestController {
    constructor(configRequestsService, utilsService) {
        this.configRequestsService = configRequestsService;
        this.utilsService = utilsService;
    }
    async createTypeFile(createTypeFileDto) {
        const response = await this.configRequestsService.createTypeFile(createTypeFileDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async findAllTypeFile() {
        const response = await this.configRequestsService.findAllTypeFile();
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async updateTypeFile(param, updateTypeDileDto) {
        const response = await this.configRequestsService.ModifyTypeFile(param.id, updateTypeDileDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async create(createLawyersDto) {
        const response = await this.configRequestsService.createLawyer(createLawyersDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async findAll(req) {
        const response = await this.configRequestsService.findAllLawyer();
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async findOne(param) {
        const response = await this.configRequestsService.getOneLawyer(param.id);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
    async update(param, updateLawyerDto) {
        const response = await this.configRequestsService.updateLawyer(param.id, updateLawyerDto);
        if (!response.success)
            return await this.utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Post)('createtypefile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_typefile_dto_1.CreateTypeFileDto]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "createTypeFile", null);
__decorate([
    (0, common_1.Get)('typefile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "findAllTypeFile", null);
__decorate([
    (0, common_1.Patch)('modifytypefile/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_typefile_dto_1.UpdateTypeFileDto]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "updateTypeFile", null);
__decorate([
    (0, common_1.Post)('createlawyers'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lawyers_dto_1.CreateLawyersDto]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('lawyers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('lawyer/:id'),
    (0, common_1.UseGuards)(auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('modifylawyers/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_lawyers_dto_1.UpdateLawyersDto]),
    __metadata("design:returntype", Promise)
], ConfigRequestController.prototype, "update", null);
ConfigRequestController = __decorate([
    (0, common_1.Controller)('configrequest'),
    __metadata("design:paramtypes", [config_request_service_1.ConfigRequestService,
        utils_service_1.UtilsService])
], ConfigRequestController);
exports.ConfigRequestController = ConfigRequestController;
//# sourceMappingURL=config-request.controller.js.map