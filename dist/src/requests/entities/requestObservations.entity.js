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
exports.RequestObservations = void 0;
const typeorm_1 = require("typeorm");
const request_entity_1 = require("./request.entity");
const users_entity_1 = require("../../users/entities/users.entity");
let RequestObservations = class RequestObservations {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RequestObservations.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestHeader, request => request.id),
    (0, typeorm_1.JoinColumn)({ name: 'id_request' }),
    __metadata("design:type", Object)
], RequestObservations.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content' }),
    __metadata("design:type", String)
], RequestObservations.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestObservations.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (user) => user.id),
    __metadata("design:type", Object)
], RequestObservations.prototype, "userCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observationType' }),
    __metadata("design:type", String)
], RequestObservations.prototype, "observationType", void 0);
RequestObservations = __decorate([
    (0, typeorm_1.Entity)('requestObservations')
], RequestObservations);
exports.RequestObservations = RequestObservations;
//# sourceMappingURL=requestObservations.entity.js.map