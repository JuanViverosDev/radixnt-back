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
exports.AttachVoucherDto = void 0;
const class_validator_1 = require("class-validator");
var UserTypes;
(function (UserTypes) {
    UserTypes["quejoso"] = "quejoso";
    UserTypes["disciplinado"] = "disciplinado";
    UserTypes["apoderado"] = "apoderado";
})(UserTypes || (UserTypes = {}));
var Types;
(function (Types) {
    Types["comunicacion"] = "comunicacion";
    Types["notificacion"] = "notificacion";
})(Types || (Types = {}));
class AttachVoucherDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "documentId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "base64", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "fileType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "userType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachVoucherDto.prototype, "date", void 0);
exports.AttachVoucherDto = AttachVoucherDto;
//# sourceMappingURL=attach-voucher.dto.js.map