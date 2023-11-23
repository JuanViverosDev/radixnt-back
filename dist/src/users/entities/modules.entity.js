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
exports.Modules = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const roles_entity_1 = require("./roles.entity");
const catModules_entity_1 = require("./catModules.entity");
let Modules = class Modules {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Modules.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name" }),
    __metadata("design:type", String)
], Modules.prototype, "moduleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "component", nullable: true }),
    __metadata("design:type", String)
], Modules.prototype, "moduleComponent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "url", nullable: true }),
    __metadata("design:type", String)
], Modules.prototype, "moduleUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "icon", nullable: true }),
    __metadata("design:type", String)
], Modules.prototype, "moduleIcon", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => roles_entity_1.Roles, (roles) => roles.roleModules),
    (0, typeorm_1.JoinTable)({ name: 'modules_roles' }),
    __metadata("design:type", Array)
], Modules.prototype, "moduleRole", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catModules_entity_1.CategoryModule, (category) => category.categoryModule),
    __metadata("design:type", catModules_entity_1.CategoryModule)
], Modules.prototype, "moduleCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order', default: 1 }),
    __metadata("design:type", Number)
], Modules.prototype, "moduleOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', default: true }),
    __metadata("design:type", Boolean)
], Modules.prototype, "moduleState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", String)
], Modules.prototype, "permission", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Modules.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Modules.prototype, "updatedAt", void 0);
Modules = __decorate([
    (0, typeorm_1.Entity)('modules')
], Modules);
exports.Modules = Modules;
//# sourceMappingURL=modules.entity.js.map