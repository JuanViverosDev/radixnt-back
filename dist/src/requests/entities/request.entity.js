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
exports.RequestHeader = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../users/entities/users.entity");
const processState_entity_1 = require("./processState.entity");
const typeRequest_entity_1 = require("./typeRequest.entity");
const requestDisciplined_entity_1 = require("./requestDisciplined.entity");
const attachment_entity_1 = require("../../attachments/entities/attachment.entity");
const requestState_entity_1 = require("./requestState.entity");
const requestObservations_entity_1 = require("./requestObservations.entity");
const requestStage_entity_1 = require("./requestStage.entity");
const attachment_v2_entity_1 = require("../../attachments-v2/entities/attachment-v2.entity");
let RequestHeader = class RequestHeader {
    constructor() {
        this.enabled = true;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RequestHeader.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", Number)
], RequestHeader.prototype, "consecutivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "radicado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "expediente", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "nombreSolicitante", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'calidad_solicitante', nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "calidadSolicitante", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "etapa", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "documentalTypeSelected", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "comunicationChannelSelected", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "direccionCorrespondencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "nombreFuncionario", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "dependecia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "positionSelected", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], RequestHeader.prototype, "systemState", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (user) => user.id, { cascade: true }),
    __metadata("design:type", users_entity_1.Users)
], RequestHeader.prototype, "agentSelected", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => typeRequest_entity_1.TypeRequest, (type) => type.id),
    __metadata("design:type", typeRequest_entity_1.TypeRequest)
], RequestHeader.prototype, "applicantTypeRequest", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => requestDisciplined_entity_1.RequestDisciplined, (disciplined) => disciplined.requestHeader, { cascade: true }),
    __metadata("design:type", Array)
], RequestHeader.prototype, "disciplined", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "authorIdentified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "indagacionPrevia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "disciplanaryInvestigation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "recursoApelacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "procedeRecursoApelacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "decisionEvaluacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "continueInvestigation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "decisionSegundaInstancia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "decisionSegundaInstanciaOtros", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "confesar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "tieneApoderado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "procedeConfesion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "medioJuzgamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "aceptaCargos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "apruebaPruebasCompletas", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "apelaFallo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "presentaRecursoApelacionAutoDecisionPruebas", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "concedeRecurso", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "hayNulidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "archiveDisciplanaryInvestigation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "recursoApelacionJuzgamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "procedeRecursoApelacionJuzgamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "continueInvestigationJuzgamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'number_settled' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "numberSettled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'applicant_name' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "applicantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'employee_full_name' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "employeeFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'employee_dependency' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "employeeDependency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'employee_position' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "employeePosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'employee_email' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "employeeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'employee_address' }),
    __metadata("design:type", String)
], RequestHeader.prototype, "employeeAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "fileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "nameRequester", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (user) => user.id),
    __metadata("design:type", users_entity_1.Users)
], RequestHeader.prototype, "userReceive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_folder', nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "s3Folder", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attachment_entity_1.Attachment, (attachment) => attachment.requestHeader),
    __metadata("design:type", Array)
], RequestHeader.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attachment_v2_entity_1.AttachmentV2, (attachment) => attachment.request),
    __metadata("design:type", Array)
], RequestHeader.prototype, "attachmentsV2", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => processState_entity_1.ProcessState, (state) => state.id),
    __metadata("design:type", processState_entity_1.ProcessState)
], RequestHeader.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RequestHeader.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => requestState_entity_1.RequestState, (requestState) => requestState.id),
    __metadata("design:type", requestState_entity_1.RequestState)
], RequestHeader.prototype, "requestState", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => requestObservations_entity_1.RequestObservations, (requestObservation) => requestObservation.requestId),
    __metadata("design:type", Array)
], RequestHeader.prototype, "requestObservations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => requestStage_entity_1.RequestStage, (requestStage) => requestStage.id, {
        cascade: true,
    }),
    (0, typeorm_1.JoinTable)({ name: 'request_requestStages' }),
    __metadata("design:type", Array)
], RequestHeader.prototype, "requestStages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'compliance_facts', nullable: true }),
    __metadata("design:type", Date)
], RequestHeader.prototype, "complianceFacts", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'proceedings_numbers', nullable: true, array: true }),
    __metadata("design:type", Array)
], RequestHeader.prototype, "proceedingsNumbers", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: true }),
    __metadata("design:type", Boolean)
], RequestHeader.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestHeader.prototype, "cedulaSolicitante", void 0);
RequestHeader = __decorate([
    (0, typeorm_1.Entity)('request_header')
], RequestHeader);
exports.RequestHeader = RequestHeader;
//# sourceMappingURL=request.entity.js.map