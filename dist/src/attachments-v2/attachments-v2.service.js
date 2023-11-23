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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsV2Service = void 0;
const common_1 = require("@nestjs/common");
const attachment_v2_entity_1 = require("./entities/attachment-v2.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const nestjs_s3_1 = require("nestjs-s3");
const config_1 = require("@nestjs/config");
let AttachmentsV2Service = class AttachmentsV2Service {
    constructor(attachmentv2Repository, s3, configService) {
        this.attachmentv2Repository = attachmentv2Repository;
        this.s3 = s3;
        this.configService = configService;
    }
    async saveAttachments(requestId, attachments) {
        try {
            attachments.forEach(att => {
                return Object.assign(Object.assign({}, att), { request: requestId });
            });
            return {
                success: true,
                data: await this.attachmentv2Repository.save(attachments)
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }
    async getAttachments(requestId) {
        try {
            const attachments = await this.attachmentv2Repository.find({
                where: {
                    request: {
                        id: requestId
                    }
                }
            });
            return {
                success: true,
                data: attachments
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message
            };
        }
    }
    async paginate(requestId, attachments) {
        try {
            const request = (await this.attachmentv2Repository.findOne({
                where: {
                    s3Key: attachments[0].s3Key
                },
                relations: ['request']
            })).request;
            const objects = await this.s3.getObject({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: request.s3Folder
            }).promise();
            return {
                success: true
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
AttachmentsV2Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(attachment_v2_entity_1.AttachmentV2)),
    __param(1, (0, nestjs_s3_1.InjectS3)()),
    __metadata("design:paramtypes", [typeorm_1.Repository, typeof (_a = typeof nestjs_s3_1.S3 !== "undefined" && nestjs_s3_1.S3) === "function" ? _a : Object, config_1.ConfigService])
], AttachmentsV2Service);
exports.AttachmentsV2Service = AttachmentsV2Service;
//# sourceMappingURL=attachments-v2.service.js.map