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
exports.RequestState = void 0;
const roles_entity_1 = require("../../users/entities/roles.entity");
const typeorm_1 = require("typeorm");
let RequestState = class RequestState {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RequestState.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stateName' }),
    __metadata("design:type", String)
], RequestState.prototype, "stateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stageName', nullable: true }),
    __metadata("design:type", String)
], RequestState.prototype, "stageName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'faseName', nullable: true }),
    __metadata("design:type", String)
], RequestState.prototype, "faseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], RequestState.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], RequestState.prototype, "isBusinessDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'previous_days', nullable: true }),
    __metadata("design:type", Number)
], RequestState.prototype, "previousDays", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => roles_entity_1.Roles, (roles) => roles.id, { cascade: true }),
    (0, typeorm_1.JoinTable)({ name: 'requestState_roles' }),
    __metadata("design:type", Array)
], RequestState.prototype, "alertRoles", void 0);
RequestState = __decorate([
    (0, typeorm_1.Entity)('requestState')
], RequestState);
exports.RequestState = RequestState;
//# sourceMappingURL=requestState.entity.js.map