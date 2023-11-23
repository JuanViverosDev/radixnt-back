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
exports.RequestDisciplined = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const request_entity_1 = require("./request.entity");
const lawyers_entity_1 = require("../../config-request/entities/lawyers.entity");
let RequestDisciplined = class RequestDisciplined {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "identificacion" }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "identificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "name", nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primer_apellido', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "primerApellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'segundo_apellido', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "segundoApellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "email" }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dependencia' }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "dependencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cargo' }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "cargo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isDisciplined' }),
    __metadata("design:type", Boolean)
], RequestDisciplined.prototype, "isDisciplined", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestHeader, (req) => req.disciplined),
    (0, typeorm_1.JoinColumn)({ name: 'requestHeaderId' }),
    __metadata("design:type", Object)
], RequestDisciplined.prototype, "requestHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_ingreso', nullable: true }),
    __metadata("design:type", Date)
], RequestDisciplined.prototype, "fechaIngreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_vinculacion', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "tipoVinculacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_contrato', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "tipoContrato", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'direccion_residencia', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "direccionResidencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ciudad_residencia', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "ciudadResidencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_dpto_residencia', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "nombreDptoResidencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medio_a_comunicar', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "medioAComunicar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_registro', nullable: true }),
    __metadata("design:type", String)
], RequestDisciplined.prototype, "numeroRegistro", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestDisciplined.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestDisciplined.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lawyers_entity_1.Lawyers),
    __metadata("design:type", Object)
], RequestDisciplined.prototype, "lawyer", void 0);
RequestDisciplined = __decorate([
    (0, typeorm_1.Entity)('request_disciplined')
], RequestDisciplined);
exports.RequestDisciplined = RequestDisciplined;
//# sourceMappingURL=requestDisciplined.entity.js.map