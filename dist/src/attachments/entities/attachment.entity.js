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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const attachmentType_entity_1 = require("./attachmentType.entity");
const request_entity_1 = require("../../requests/entities/request.entity");
let Attachment = class Attachment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Attachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name" }),
    __metadata("design:type", String)
], Attachment.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Attachment.prototype, "base64", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attachmentType_entity_1.AttachmentType, (attach) => attach.id),
    __metadata("design:type", attachmentType_entity_1.AttachmentType)
], Attachment.prototype, "attachType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Attachment.prototype, "attachState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fileType' }),
    __metadata("design:type", String)
], Attachment.prototype, "fileType", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestHeader, (request) => request.attachments),
    __metadata("design:type", request_entity_1.RequestHeader)
], Attachment.prototype, "requestHeader", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Attachment.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Attachment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'documentType', nullable: true }),
    __metadata("design:type", String)
], Attachment.prototype, "documentType", void 0);
Attachment = __decorate([
    (0, typeorm_1.Entity)('attachment')
], Attachment);
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.entity.js.map