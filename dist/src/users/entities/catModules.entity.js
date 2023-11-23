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
exports.CategoryModule = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const modules_entity_1 = require("./modules.entity");
let CategoryModule = class CategoryModule {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CategoryModule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name", unique: true }),
    __metadata("design:type", String)
], CategoryModule.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => modules_entity_1.Modules, (module) => module.moduleCategory),
    __metadata("design:type", Array)
], CategoryModule.prototype, "categoryModule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order', default: 1 }),
    __metadata("design:type", Number)
], CategoryModule.prototype, "categoryOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', default: true }),
    __metadata("design:type", Boolean)
], CategoryModule.prototype, "categoryState", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CategoryModule.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CategoryModule.prototype, "updatedAt", void 0);
CategoryModule = __decorate([
    (0, typeorm_1.Entity)('category_module')
], CategoryModule);
exports.CategoryModule = CategoryModule;
//# sourceMappingURL=catModules.entity.js.map