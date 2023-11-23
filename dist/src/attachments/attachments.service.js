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
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const request_entity_1 = require("../requests/entities/request.entity");
const typeorm_2 = require("typeorm");
const attachment_entity_1 = require("./entities/attachment.entity");
const attachmentType_entity_1 = require("./entities/attachmentType.entity");
let AttachmentsService = class AttachmentsService {
    constructor(repositoryAttachment, repositoryAttachmentType, repositoryRequestHeader) {
        this.repositoryAttachment = repositoryAttachment;
        this.repositoryAttachmentType = repositoryAttachmentType;
        this.repositoryRequestHeader = repositoryRequestHeader;
    }
    async createAttachment(createAttach) {
        try {
            const currentType = await this.repositoryAttachmentType.findOne({ where: { id: createAttach.id_attachType } });
            const currentRequest = await this.repositoryRequestHeader.findOne({ where: { id: createAttach.id_requestHeader } });
            if (!currentType || !currentRequest) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            createAttach.attachType = currentType;
            createAttach.requestHeader = currentRequest;
            const newAttach = await this.repositoryAttachment.save(createAttach);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(attachment_entity_1.Attachment, newAttach),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyAttachment(id, updateAttachmentDto) {
        try {
            const currentAttach = await this.repositoryAttachment.findOne({
                where: { id: id },
            });
            if (updateAttachmentDto.attachmentName)
                currentAttach.fileName = updateAttachmentDto.attachmentName;
            if (updateAttachmentDto.base64)
                currentAttach.base64 = updateAttachmentDto.base64;
            if (updateAttachmentDto.id_attachType) {
                const curretType = await this.repositoryAttachmentType.findOne({ where: { id: updateAttachmentDto.id_attachType } });
                if (curretType)
                    currentAttach.attachType = curretType;
            }
            if (updateAttachmentDto.id_requestHeader) {
                const curretHeader = await this.repositoryRequestHeader.findOne({ where: { id: updateAttachmentDto.id_requestHeader } });
                if (curretHeader)
                    currentAttach.requestHeader = curretHeader;
            }
            if (updateAttachmentDto.attachState !== undefined)
                currentAttach.attachState = updateAttachmentDto.attachState;
            const modifyAttach = await this.repositoryAttachment.save(currentAttach);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(attachment_entity_1.Attachment, modifyAttach),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getAttachmentRequest(id) {
        try {
            const currentAttach = await this.repositoryAttachment.find({
                where: {
                    requestHeader: { id: id },
                },
            });
            if (currentAttach) {
                return {
                    success: true,
                    data: (0, class_transformer_1.plainToInstance)(attachment_entity_1.Attachment, currentAttach),
                };
            }
            else {
                return {
                    success: false,
                    code: 'CD001',
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getListtypes() {
        try {
            const currentAttach = await this.repositoryAttachmentType.find({
                where: { stateAttachmentType: true }
            });
            if (currentAttach) {
                return {
                    success: true,
                    data: (0, class_transformer_1.plainToInstance)(attachment_entity_1.Attachment, currentAttach),
                };
            }
            else {
                return {
                    success: true,
                    data: []
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __param(1, (0, typeorm_1.InjectRepository)(attachmentType_entity_1.AttachmentType)),
    __param(2, (0, typeorm_1.InjectRepository)(request_entity_1.RequestHeader)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttachmentsService);
exports.AttachmentsService = AttachmentsService;
//# sourceMappingURL=attachments.service.js.map