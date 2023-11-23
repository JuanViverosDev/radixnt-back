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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const utils_service_1 = require("../utils/utils.service");
const create_template_dto_1 = require("./../requests/dto/create-template.dto");
const update_template_dto_1 = require("./../requests/dto/update-template.dto");
let TemplatesController = class TemplatesController {
    constructor(templatesService, utilsService) {
        this.templatesService = templatesService;
        this.utilsService = utilsService;
    }
    async getAllTemplates() {
        const response = await this.templatesService.getAllTemplates();
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async createTemplate(template) {
        const response = await this.templatesService.createTemplate(template);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
    async updateTemplate(template) {
        const response = await this.templatesService.updateTemplate(template);
        if (!response.success)
            return this.utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getAllTemplates", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Patch)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateTemplate", null);
TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        utils_service_1.UtilsService])
], TemplatesController);
exports.TemplatesController = TemplatesController;
//# sourceMappingURL=templates.controller.js.map