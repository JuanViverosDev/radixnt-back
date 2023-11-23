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
exports.AttachmentV2 = void 0;
const typeorm_1 = require("typeorm");
const request_entity_1 = require("../../requests/entities/request.entity");
let AttachmentV2 = class AttachmentV2 {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 's3_key' }),
    __metadata("design:type", String)
], AttachmentV2.prototype, "s3Key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttachmentV2.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type' }),
    __metadata("design:type", String)
], AttachmentV2.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => request_entity_1.RequestHeader, request => request.attachmentsV2),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", Object)
], AttachmentV2.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AttachmentV2.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AttachmentV2.prototype, "updatedAt", void 0);
AttachmentV2 = __decorate([
    (0, typeorm_1.Entity)('attachments_v2')
], AttachmentV2);
exports.AttachmentV2 = AttachmentV2;
//# sourceMappingURL=attachment-v2.entity.js.map