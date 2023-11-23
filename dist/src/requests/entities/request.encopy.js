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
exports.RequestHeader_old = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const users_entity_1 = require("../../users/entities/users.entity");
const processState_entity_1 = require("./processState.entity");
let RequestHeader_old = class RequestHeader_old {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_settled' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "numberSettled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applicant_name' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "applicantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_full_name' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "employeeFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_dependency' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "employeeDependency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_position' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "employeePosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_email' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "employeeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_address' }),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "employeeAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "fileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "nameRequester", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (user) => user.id),
    __metadata("design:type", users_entity_1.Users)
], RequestHeader_old.prototype, "userReceive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader_old.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestHeader_old.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => processState_entity_1.ProcessState, (state) => state.id),
    __metadata("design:type", processState_entity_1.ProcessState)
], RequestHeader_old.prototype, "state", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader_old.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader_old.prototype, "updatedAt", void 0);
RequestHeader_old = __decorate([
    (0, typeorm_1.Entity)('request_header')
], RequestHeader_old);
exports.RequestHeader_old = RequestHeader_old;
//# sourceMappingURL=request.encopy.js.map