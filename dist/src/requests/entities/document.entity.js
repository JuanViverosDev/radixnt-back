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
exports.Documents = void 0;
const typeorm_1 = require("typeorm");
const request_entity_1 = require("./request.entity");
const requestStage_entity_1 = require("./requestStage.entity");
let Documents = class Documents {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Documents.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestHeader, (request) => request.id),
    (0, typeorm_1.JoinColumn)({ name: 'id_request' }),
    __metadata("design:type", Object)
], Documents.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title' }),
    __metadata("design:type", String)
], Documents.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state' }),
    __metadata("design:type", String)
], Documents.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content' }),
    __metadata("design:type", String)
], Documents.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => requestStage_entity_1.RequestStage, (stage) => stage.id),
    (0, typeorm_1.JoinColumn)({ name: 'requestStageId' }),
    __metadata("design:type", Object)
], Documents.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order', nullable: true }),
    __metadata("design:type", Number)
], Documents.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Documents.prototype, "consecutive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Documents.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_type', nullable: true }),
    __metadata("design:type", String)
], Documents.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_quejoso', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seNotificaQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_disciplinado', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seNotificaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_quejoso', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seComunicaQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_disciplinado', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seComunicaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_quejoso', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaNotificacionQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaNotificacionDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_quejoso', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaComunicacionQuejoso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaComunicacionDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_fisica_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaComunicacionFisicaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_fisica_disciplinado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaNotificacionFisicaDisciplinado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_notifica_apoderado', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seComunicaApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'se_comunica_apoderado', nullable: true }),
    __metadata("design:type", Boolean)
], Documents.prototype, "seNotificaApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_notificacion_apoderado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaNotificacionApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_comunicacion_apoderado', nullable: true }),
    __metadata("design:type", Date)
], Documents.prototype, "fechaComunicacionApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'communications_and_notifications_data',
        type: 'jsonb',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Documents.prototype, "communicationsAndNotificationsData", void 0);
Documents = __decorate([
    (0, typeorm_1.Entity)('documents')
], Documents);
exports.Documents = Documents;
//# sourceMappingURL=document.entity.js.map