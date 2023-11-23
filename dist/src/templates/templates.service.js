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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const template_entity_1 = require("./../requests/entities/template.entity");
const requestStage_entity_1 = require("./../requests/entities/requestStage.entity");
const typeorm_2 = require("typeorm");
let TemplatesService = class TemplatesService {
    constructor(templatesRepository, requestsStageRepository) {
        this.templatesRepository = templatesRepository;
        this.requestsStageRepository = requestsStageRepository;
    }
    async getAllTemplates() {
        try {
            const templates = await this.templatesRepository.find({
                relations: ['requestStage'],
                order: {
                    requestStage: {
                        id: 'ASC'
                    }
                }
            });
            return {
                success: true,
                data: templates
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }
    async createTemplate(template) {
        try {
            const lastKey = (await this.templatesRepository.createQueryBuilder()
                .select('MAX(templates.id)')
                .from(template_entity_1.Template, 'templates')
                .getRawOne()).max;
            const newTemplate = await this.templatesRepository.save(Object.assign(Object.assign({}, template), { id: lastKey + 1 }));
            return {
                success: true,
                data: newTemplate
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }
    async updateTemplate(template) {
        try {
            const updatedTemplate = await this.templatesRepository.save(template);
            return {
                success: true,
                data: updatedTemplate
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }
};
TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __param(1, (0, typeorm_1.InjectRepository)(requestStage_entity_1.RequestStage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TemplatesService);
exports.TemplatesService = TemplatesService;
//# sourceMappingURL=templates.service.js.map