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
exports.ConfigRequestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_2 = require("typeorm");
const lawyers_entity_1 = require("./entities/lawyers.entity");
const typeFile_entity_1 = require("./entities/typeFile.entity");
let ConfigRequestService = class ConfigRequestService {
    constructor(repositoryTypeFile, repositoryLawyers) {
        this.repositoryTypeFile = repositoryTypeFile;
        this.repositoryLawyers = repositoryLawyers;
    }
    async createTypeFile(createTypeDto) {
        try {
            const saveTypeTypeFile = await this.repositoryTypeFile.save(createTypeDto);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeFile_entity_1.TypeFile, saveTypeTypeFile),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAllTypeFile() {
        try {
            const listTypeTypeFile = await this.repositoryTypeFile.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeFile_entity_1.TypeFile, listTypeTypeFile),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyTypeFile(id, updateTypeFileDto) {
        try {
            const currentTypeTypeFile = await this.repositoryTypeFile.findOne({
                where: { id: id },
            });
            if (!currentTypeTypeFile) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (updateTypeFileDto.typeFileName)
                currentTypeTypeFile.typeFileName = updateTypeFileDto.typeFileName;
            currentTypeTypeFile.typeFileState = updateTypeFileDto.typeFileState;
            const modifyPotition = await this.repositoryTypeFile.save(currentTypeTypeFile);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeFile_entity_1.TypeFile, modifyPotition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async createLawyer(createLawyerDto) {
        try {
            const saveLawyer = await this.repositoryLawyers.save(createLawyerDto);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(lawyers_entity_1.Lawyers, saveLawyer),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAllLawyer() {
        try {
            const listLawyer = await this.repositoryLawyers.find();
            return {
                success: true,
                data: listLawyer,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getOneLawyer(id) {
        try {
            const requestHeader = await this.repositoryLawyers.findOne({
                where: { id: id },
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(lawyers_entity_1.Lawyers, requestHeader),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async updateLawyer(id, updateLawyerDto) {
        try {
            const currentLawyer = await this.repositoryLawyers.findOne({
                where: { id: id },
            });
            if (!currentLawyer) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (updateLawyerDto.publicDefenderName)
                currentLawyer.publicDefenderName = updateLawyerDto.publicDefenderName;
            if (updateLawyerDto.publicDefenderPhone)
                currentLawyer.publicDefenderPhone = updateLawyerDto.publicDefenderPhone;
            if (updateLawyerDto.publicDefenderAddress)
                currentLawyer.publicDefenderAddress = updateLawyerDto.publicDefenderAddress;
            if (updateLawyerDto.publicDefenderEmail)
                currentLawyer.publicDefenderEmail = updateLawyerDto.publicDefenderEmail;
            if (updateLawyerDto.publicDefenderCompany)
                currentLawyer.publicDefenderCompany = updateLawyerDto.publicDefenderCompany;
            if (updateLawyerDto.publicDefenderStartDate)
                currentLawyer.publicDefenderStartDate = updateLawyerDto.publicDefenderStartDate;
            if (updateLawyerDto.publicDefenderEndDate)
                currentLawyer.publicDefenderEndDate = updateLawyerDto.publicDefenderEndDate;
            if (updateLawyerDto.howManyProceedingsNumber)
                currentLawyer.howManyProceedingsNumber = updateLawyerDto.howManyProceedingsNumber;
            if (updateLawyerDto.proceedingsNumbers)
                currentLawyer.proceedingsNumbers = updateLawyerDto.proceedingsNumbers;
            if (updateLawyerDto.publicDefenderState !== null && updateLawyerDto.publicDefenderState !== undefined)
                currentLawyer.publicDefenderState = updateLawyerDto.publicDefenderState;
            if (updateLawyerDto.medioAComunicar)
                currentLawyer.medioAComunicar = updateLawyerDto.medioAComunicar;
            if (updateLawyerDto.publicDefenderId)
                currentLawyer.publicDefenderId = updateLawyerDto.publicDefenderId;
            const modifyLawyer = await this.repositoryLawyers.save(currentLawyer);
            return {
                success: true,
                data: modifyLawyer,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
ConfigRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(typeFile_entity_1.TypeFile)),
    __param(1, (0, typeorm_1.InjectRepository)(lawyers_entity_1.Lawyers)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ConfigRequestService);
exports.ConfigRequestService = ConfigRequestService;
//# sourceMappingURL=config-request.service.js.map