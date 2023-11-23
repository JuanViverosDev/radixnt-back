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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const positions_entity_1 = require("./positions.entity");
const roles_entity_1 = require("./roles.entity");
let Users = class Users {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name" }),
    __metadata("design:type", String)
], Users.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "last_name" }),
    __metadata("design:type", String)
], Users.prototype, "userLastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email" }),
    __metadata("design:type", String)
], Users.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "firebase_uuid" }),
    __metadata("design:type", String)
], Users.prototype, "fireBaseUUID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => positions_entity_1.Positions, (positions) => positions.id),
    (0, typeorm_1.JoinColumn)({ name: 'id_position' }),
    __metadata("design:type", positions_entity_1.Positions)
], Users.prototype, "userPosition", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_entity_1.Roles, (role) => role.id),
    (0, typeorm_1.JoinColumn)({ name: 'id_role' }),
    __metadata("design:type", roles_entity_1.Roles)
], Users.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => roles_entity_1.Roles),
    (0, typeorm_1.JoinTable)({ name: 'users_roles' }),
    __metadata("design:type", Array)
], Users.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', default: true }),
    __metadata("design:type", Boolean)
], Users.prototype, "userState", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
Users = __decorate([
    (0, typeorm_1.Entity)('users')
], Users);
exports.Users = Users;
//# sourceMappingURL=users.entity.js.map