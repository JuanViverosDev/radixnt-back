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
exports.Template = void 0;
const typeorm_1 = require("typeorm");
const requestStage_entity_1 = require("./requestStage.entity");
let Template = class Template {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Template.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'templateName' }),
    __metadata("design:type", String)
], Template.prototype, "templateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'templateContent' }),
    __metadata("design:type", String)
], Template.prototype, "templateContent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => requestStage_entity_1.RequestStage, (requestStage) => requestStage.id),
    (0, typeorm_1.JoinColumn)({ name: 'requestStageId' }),
    __metadata("design:type", Object)
], Template.prototype, "requestStage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order', nullable: true }),
    __metadata("design:type", Number)
], Template.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Template.prototype, "consecutive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Template.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_vario', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "isVario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_type', nullable: true }),
    __metadata("design:type", String)
], Template.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_quejoso', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seNotificaQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_disciplinado', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seNotificaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_quejoso', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seComunicaQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_disciplinado', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seComunicaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_quejoso', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaNotificacionQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaNotificacionDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_quejoso', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaComunicacionQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaComunicacionDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_apoderado', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seComunicaApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_apoderado', nullable: true }),
    __metadata("design:type", Boolean)
], Template.prototype, "seNotificaApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_apoderado', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaNotificacionApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_apoderado', nullable: true }),
    __metadata("design:type", Date)
], Template.prototype, "fechaComunicacionApoderado", void 0);
Template = __decorate([
    (0, typeorm_1.Entity)('template')
], Template);
exports.Template = Template;
//# sourceMappingURL=template.entity.js.map