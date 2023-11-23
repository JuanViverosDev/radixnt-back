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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_2 = require("typeorm");
const processState_entity_1 = require("./entities/processState.entity");
const request_entity_1 = require("./entities/request.entity");
const requestDisciplined_entity_1 = require("./entities/requestDisciplined.entity");
const typeCommunication_entity_1 = require("./entities/typeCommunication.entity");
const typeRequest_entity_1 = require("./entities/typeRequest.entity");
const document_entity_1 = require("./entities/document.entity");
const requestObservations_entity_1 = require("./entities/requestObservations.entity");
const requestStage_entity_1 = require("./entities/requestStage.entity");
const users_service_1 = require("../users/users.service");
const requestState_entity_1 = require("./entities/requestState.entity");
const attachment_entity_1 = require("../attachments/entities/attachment.entity");
const template_entity_1 = require("./entities/template.entity");
const observations_service_1 = require("./observations.service");
const config_entity_1 = require("./entities/config.entity");
const pdf_lib_1 = require("pdf-lib");
const folio_entity_1 = require("./entities/folio.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const schedule_1 = require("@nestjs/schedule");
const moment = require("moment");
const handlebars = require("handlebars");
const axios_1 = require("@nestjs/axios");
let RequestsService = class RequestsService {
    constructor(repositoryRequestHeader, repositoryTypeRequest, repositoryProcessState, repositoryTypeCommunication, repositoryRequestDisciplined, repositoryDocuments, repositoryRequestObservations, repositoryRequestStage, repositoryRequestState, usersService, repositoryAttachment, repositoryTemplate, repositoryConfig, repositoryFolio, observationsService, notificationsService, httpService) {
        this.repositoryRequestHeader = repositoryRequestHeader;
        this.repositoryTypeRequest = repositoryTypeRequest;
        this.repositoryProcessState = repositoryProcessState;
        this.repositoryTypeCommunication = repositoryTypeCommunication;
        this.repositoryRequestDisciplined = repositoryRequestDisciplined;
        this.repositoryDocuments = repositoryDocuments;
        this.repositoryRequestObservations = repositoryRequestObservations;
        this.repositoryRequestStage = repositoryRequestStage;
        this.repositoryRequestState = repositoryRequestState;
        this.usersService = usersService;
        this.repositoryAttachment = repositoryAttachment;
        this.repositoryTemplate = repositoryTemplate;
        this.repositoryConfig = repositoryConfig;
        this.repositoryFolio = repositoryFolio;
        this.observationsService = observationsService;
        this.notificationsService = notificationsService;
        this.httpService = httpService;
    }
    async create(createRequestDto) {
        var _a;
        try {
            const initialStage = await this.repositoryRequestStage.findOne({
                where: { id: 1 },
            });
            let initialArray = [];
            initialArray.push(initialStage);
            createRequestDto.requestStages = initialArray;
            let newState = await this.repositoryRequestState.findOne({
                where: { id: 2 },
            });
            createRequestDto.requestState = newState;
            const userAssing = await this.usersService.getUserByRoleName('Director de Instruccion');
            const userEmail = userAssing.data.userEmail;
            createRequestDto.agentSelected = userAssing.data;
            createRequestDto.expediente = '0';
            const now = new Date();
            now.setMonth(now.getMonth() + 1, now.getDay());
            createRequestDto.expireDate = now;
            const saveRequest = await this.repositoryRequestHeader.save(Object.assign(Object.assign({}, createRequestDto), { enabled: true }));
            await this.createInitialDocumentsV2(saveRequest);
            await this.observationsService.logObservationOrSystemLog(saveRequest.id, 'Se creó la petición', null, 'system');
            (_a = createRequestDto.attachments) === null || _a === void 0 ? void 0 : _a.forEach(async (attachment) => {
                await this.repositoryAttachment.save(Object.assign(Object.assign({}, attachment), { requestHeader: saveRequest }));
            });
            if (createRequestDto.requestObservations.length > 0) {
                await this.observationsService.logObservationOrSystemLog(saveRequest.id, createRequestDto.requestObservations[0].content, createRequestDto.userId, 'user');
            }
            if (createRequestDto.documentalTypeSelected === 'Oficio' ||
                createRequestDto.documentalTypeSelected === 'Memorando') {
                await this.handleOficioOrMemorando(saveRequest);
            }
            try {
                await this.notificationsService.sendEmail({
                    recipient: userEmail,
                    templateName: 'assignationTemplate',
                    data: {
                        nombre: '' +
                            userAssing.data.userName +
                            ' ' +
                            userAssing.data.userLastName,
                        nombreQuejoso: createRequestDto.nombreSolicitante,
                    },
                });
                await this.observationsService.logObservationOrSystemLog(saveRequest.id, `Se envia email a ${userEmail}`, null, 'system');
            }
            catch (error) {
                console.log('Error enviando correo');
            }
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, saveRequest),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async createInitialDocumentsV2(request) {
        const globalConfig = (await this.getGlobalConfig()).data;
        let documents = await Promise.all((await this.repositoryTemplate.find({
            relations: ['requestStage'],
            where: {
                requestStage: {
                    id: 1,
                },
            },
        })).map(async (template) => {
            const templateContent = handlebars.compile(template.templateContent);
            const html = templateContent({ request, template, globalConfig });
            return {
                requestId: request.id,
                content: html !== null && html !== void 0 ? html : template.templateContent,
                stage: template.requestStage,
                order: template.order,
                title: template.templateName,
                state: 'Por completar',
                documentType: template.documentType,
                consecutive: null,
                prefix: null,
                seNotificaDisciplinado: template.seNotificaDisciplinado,
                seNotificaQuejoso: template.seNotificaQuejoso,
                seComunicaDisciplinado: template.seComunicaDisciplinado,
                seComunicaQuejoso: template.seComunicaQuejoso,
                fechaNotificacionQuejoso: template.fechaNotificacionQuejoso,
                fechaComunicacionQuejoso: template.fechaComunicacionQuejoso,
                fechaComunicacionDisciplinado: template.fechaComunicacionDisciplinado,
                fechaNotificacionDisciplinado: template.fechaNotificacionDisciplinado,
            };
        }));
        await this.repositoryDocuments.save(documents);
    }
    async findAll() {
        try {
            const listRequestHeader = await this.repositoryRequestHeader.find({
                relations: [
                    'agentSelected',
                    'requestState',
                    'requestObservations',
                    'requestObservations.userCreated',
                    'requestStages',
                    'attachments',
                    'disciplined',
                    'disciplined.requestHeader',
                    'disciplined.lawyer',
                    'requestState.alertRoles',
                ],
                where: { id: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, listRequestHeader),
            };
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findRequestByUser(id) {
        try {
            const requestHeader = await this.repositoryRequestHeader.find({
                relations: [
                    'agentSelected',
                    'requestState',
                    'requestObservations',
                    'requestObservations.userCreated',
                    'requestStages',
                    'attachments',
                    'disciplined',
                    'disciplined.lawyer',
                    'disciplined.requestHeader',
                ],
                where: { agentSelected: { id } },
            });
            requestHeader.forEach((req) => {
                if (req.complianceFacts) {
                    const { complianceFacts: date } = req;
                    req.complianceFacts = new Date(date.getFullYear(), date.getMonth(), date.getDay());
                }
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, requestHeader),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findOne(id) {
        try {
            const requestHeader = await this.repositoryRequestHeader.findOne({
                relations: [
                    'agentSelected',
                    'requestState',
                    'requestObservations',
                    'requestObservations.userCreated',
                    'requestStages',
                    'attachments',
                    'disciplined',
                ],
                where: { id: id },
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, requestHeader),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async update(id, updateRequestDto) {
        var _a, _b, _c;
        try {
            let notify = false;
            let currentRequest = (await this.findOne(id)).data;
            if (!currentRequest) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            console.log(updateRequestDto.requestStateId);
            if (updateRequestDto.requestStateId) {
                currentRequest.requestState = await this.repositoryRequestState.findOne({
                    where: { id: updateRequestDto.requestStateId },
                });
                console.log(currentRequest.requestState);
            }
            await this.calculateActualRequestState(updateRequestDto, (_b = (_a = currentRequest.requestState) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 2, currentRequest.agentSelected.id, id);
            currentRequest = (await this.findOne(id)).data;
            if (updateRequestDto.radicado) {
                currentRequest.radicado = updateRequestDto.radicado;
            }
            if (updateRequestDto.expediente && currentRequest.expediente === '0') {
                currentRequest.expediente = updateRequestDto.expediente;
            }
            if (updateRequestDto.nombreSolicitante) {
                currentRequest.nombreSolicitante = updateRequestDto.nombreSolicitante;
            }
            if (updateRequestDto.calidadSolicitante) {
                currentRequest.calidadSolicitante = updateRequestDto.calidadSolicitante;
            }
            if (updateRequestDto.etapa) {
                currentRequest.etapa = updateRequestDto.etapa;
            }
            if (updateRequestDto.documentalTypeSelected) {
                currentRequest.documentalTypeSelected =
                    updateRequestDto.documentalTypeSelected;
            }
            if (updateRequestDto.comunicationChannelSelected) {
                currentRequest.comunicationChannelSelected =
                    updateRequestDto.comunicationChannelSelected;
            }
            if (updateRequestDto.direccionCorrespondencia) {
                currentRequest.direccionCorrespondencia =
                    updateRequestDto.direccionCorrespondencia;
            }
            if (updateRequestDto.correo) {
                currentRequest.correo = updateRequestDto.correo;
            }
            if (updateRequestDto.telefono) {
                currentRequest.telefono = updateRequestDto.telefono;
            }
            if (updateRequestDto.nombreFuncionario) {
                currentRequest.nombreFuncionario = updateRequestDto.nombreFuncionario;
            }
            if (updateRequestDto.dependecia) {
                currentRequest.dependecia = updateRequestDto.dependecia;
            }
            if (updateRequestDto.positionSelected) {
                currentRequest.positionSelected = updateRequestDto.positionSelected;
            }
            if (updateRequestDto.systemState) {
                currentRequest.systemState = updateRequestDto.systemState;
            }
            if (updateRequestDto.applicantType) {
                const currentType = await this.repositoryTypeRequest.findOneOrFail({
                    where: { id: updateRequestDto.applicantType },
                });
                currentRequest.applicantTypeRequest = currentType;
            }
            if (updateRequestDto.subject) {
                currentRequest.subject = updateRequestDto.subject;
            }
            if (updateRequestDto.authorIdentified) {
                currentRequest.authorIdentified = updateRequestDto.authorIdentified;
            }
            if (updateRequestDto.indagacionPrevia) {
                currentRequest.indagacionPrevia = updateRequestDto.indagacionPrevia;
            }
            if (updateRequestDto.disciplanaryInvestigation) {
                currentRequest.disciplanaryInvestigation =
                    updateRequestDto.disciplanaryInvestigation;
            }
            if (updateRequestDto.recursoApelacion) {
                currentRequest.recursoApelacion = updateRequestDto.recursoApelacion;
            }
            if (updateRequestDto.procedeRecursoApelacion) {
                currentRequest.procedeRecursoApelacion =
                    updateRequestDto.procedeRecursoApelacion;
            }
            if (updateRequestDto.decisionEvaluacion) {
                currentRequest.decisionEvaluacion = updateRequestDto.decisionEvaluacion;
            }
            if (updateRequestDto.continueInvestigation) {
                currentRequest.continueInvestigation =
                    updateRequestDto.continueInvestigation;
            }
            if (updateRequestDto.decisionSegundaInstancia) {
                currentRequest.decisionSegundaInstancia =
                    updateRequestDto.decisionSegundaInstancia;
            }
            if (updateRequestDto.decisionSegundaInstanciaOtros) {
                currentRequest.decisionSegundaInstanciaOtros =
                    updateRequestDto.decisionSegundaInstanciaOtros;
            }
            if (updateRequestDto.confesar) {
                currentRequest.confesar = updateRequestDto.confesar;
            }
            if (updateRequestDto.tieneApoderado) {
                currentRequest.tieneApoderado = updateRequestDto.tieneApoderado;
            }
            if (updateRequestDto.procedeConfesion) {
                currentRequest.procedeConfesion = updateRequestDto.procedeConfesion;
            }
            if (updateRequestDto.medioJuzgamiento) {
                currentRequest.medioJuzgamiento = updateRequestDto.medioJuzgamiento;
            }
            if (updateRequestDto.aceptaCargos) {
                currentRequest.aceptaCargos = updateRequestDto.aceptaCargos;
            }
            if (updateRequestDto.apruebaPruebasCompletas) {
                currentRequest.apruebaPruebasCompletas =
                    updateRequestDto.apruebaPruebasCompletas;
            }
            if (updateRequestDto.apelaFallo) {
                currentRequest.apelaFallo = updateRequestDto.apelaFallo;
            }
            if (updateRequestDto.presentaRecursoApelacionAutoDecisionPruebas) {
                currentRequest.presentaRecursoApelacionAutoDecisionPruebas =
                    updateRequestDto.presentaRecursoApelacionAutoDecisionPruebas;
            }
            if (updateRequestDto.concedeRecurso) {
                currentRequest.concedeRecurso = updateRequestDto.concedeRecurso;
            }
            if (updateRequestDto.hayNulidad) {
                currentRequest.hayNulidad = updateRequestDto.hayNulidad;
            }
            if (updateRequestDto.archiveDisciplanaryInvestigation) {
                currentRequest.archiveDisciplanaryInvestigation =
                    updateRequestDto.archiveDisciplanaryInvestigation;
            }
            if (updateRequestDto.recursoApelacionJuzgamiento) {
                currentRequest.recursoApelacionJuzgamiento =
                    updateRequestDto.recursoApelacionJuzgamiento;
            }
            if (updateRequestDto.procedeRecursoApelacionJuzgamiento) {
                currentRequest.procedeRecursoApelacionJuzgamiento =
                    updateRequestDto.procedeRecursoApelacionJuzgamiento;
            }
            if (updateRequestDto.continueInvestigationJuzgamiento) {
                currentRequest.continueInvestigationJuzgamiento =
                    updateRequestDto.continueInvestigationJuzgamiento;
            }
            if (updateRequestDto.numberSettled) {
                currentRequest.numberSettled = updateRequestDto.numberSettled;
            }
            if (updateRequestDto.applicantName) {
                currentRequest.applicantName = updateRequestDto.applicantName;
            }
            if (updateRequestDto.employeeFullName) {
                currentRequest.employeeFullName = updateRequestDto.employeeFullName;
            }
            if (updateRequestDto.employeeDependency) {
                currentRequest.employeeDependency = updateRequestDto.employeeDependency;
            }
            if (updateRequestDto.employeePosition) {
                currentRequest.employeePosition = updateRequestDto.employeePosition;
            }
            if (updateRequestDto.employeeEmail) {
                currentRequest.employeeEmail = updateRequestDto.employeeEmail;
            }
            if (updateRequestDto.employeeAddress) {
                currentRequest.employeeAddress = updateRequestDto.employeeAddress;
            }
            if (updateRequestDto.fileNumber) {
                currentRequest.fileNumber = updateRequestDto.fileNumber;
            }
            if (updateRequestDto.nameRequester) {
                currentRequest.nameRequester = updateRequestDto.nameRequester;
            }
            if (updateRequestDto.userReceive) {
                currentRequest.userReceive = updateRequestDto.userReceive;
            }
            if (updateRequestDto.expireDate) {
                currentRequest.expireDate = updateRequestDto.expireDate;
            }
            if (updateRequestDto.proceedingsNumbers) {
                currentRequest.proceedingsNumbers = updateRequestDto.proceedingsNumbers;
            }
            if (updateRequestDto.state_id) {
                const currentState = await this.repositoryProcessState.findOneOrFail({
                    where: { id: updateRequestDto.state_id },
                });
                currentRequest.state = currentState;
            }
            if (updateRequestDto.complianceFacts) {
                currentRequest.complianceFacts = updateRequestDto.complianceFacts;
            }
            if (updateRequestDto.enabled !== undefined) {
                currentRequest.enabled = updateRequestDto.enabled;
            }
            if (updateRequestDto.cedulaSolicitante) {
                currentRequest.cedulaSolicitante = updateRequestDto.cedulaSolicitante;
            }
            currentRequest.disciplined = await Promise.all((_c = updateRequestDto.disciplined) === null || _c === void 0 ? void 0 : _c.map(async (disciplined) => {
                return await this.repositoryRequestDisciplined.save(disciplined);
            }));
            if (updateRequestDto.requestObservations) {
                await this.observationsService.logObservationOrSystemLog(currentRequest.id, updateRequestDto.requestObservations[updateRequestDto.requestObservations.length - 1].content, updateRequestDto.userId, 'user');
            }
            const modifyRequest = await this.repositoryRequestHeader.save(currentRequest);
            const attachmentsReq = updateRequestDto.attachments;
            const attachmentsDb = currentRequest.attachments;
            if (attachmentsReq.length != attachmentsDb.length) {
                if (attachmentsReq.length < attachmentsDb.length) {
                    attachmentsDb === null || attachmentsDb === void 0 ? void 0 : attachmentsDb.forEach(async (attachment) => {
                        if (!attachmentsReq.find((id) => id.id == attachment.id)) {
                            await this.observationsService.logObservationOrSystemLog(currentRequest.id, `El archivo ${attachment.fileName} ha sido eliminado`, null, 'system');
                            await this.repositoryAttachment.remove(attachment);
                        }
                    });
                }
                else {
                    attachmentsReq === null || attachmentsReq === void 0 ? void 0 : attachmentsReq.forEach(async (attachment) => {
                        if (!attachmentsDb.find((id) => id.id == attachment.id)) {
                            await this.observationsService.logObservationOrSystemLog(currentRequest.id, `El archivo ${attachment.fileName} ha sido añadido`, null, 'system');
                            await this.repositoryAttachment.save(Object.assign(Object.assign({}, attachment), { requestHeader: modifyRequest }));
                        }
                    });
                }
            }
            if (notify) {
                const recipients = [
                    {
                        name: modifyRequest.agentSelected.userName,
                        email: modifyRequest.agentSelected.userEmail,
                    },
                ];
            }
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, modifyRequest),
            };
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async modifyStateRequest(id, state) {
        try {
            const currentRequest = await this.repositoryRequestHeader.findOne({
                where: { id: id },
            });
            if (!currentRequest) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            const currentState = await this.repositoryProcessState.findOneOrFail({
                where: { id: state },
            });
            if (!currentState) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            currentRequest.state = currentState;
            const modifyRequest = await this.repositoryRequestHeader.save(currentRequest);
            await this.observationsService.logObservationOrSystemLog(currentRequest.id, `El ${currentRequest.agentSelected.userName} ${currentRequest.agentSelected.userLastName} ha modificado el estado de la peticion`, currentRequest.agentSelected.id, 'system');
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, modifyRequest),
            };
        }
        catch (error) {
            console.log(error.message);
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async createTypeReq(createTypeDto) {
        try {
            const saveTypeRequest = await this.repositoryTypeRequest.save(createTypeDto);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeRequest_entity_1.TypeRequest, saveTypeRequest),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAllTypeReq() {
        try {
            const listTypeRequest = await this.repositoryTypeRequest.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeRequest_entity_1.TypeRequest, listTypeRequest),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyTypeReq(id, updateTypeReqDto) {
        try {
            const currentTypeRequest = await this.repositoryTypeRequest.findOne({
                where: { id: id },
            });
            if (!currentTypeRequest) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (updateTypeReqDto.typeReqName)
                currentTypeRequest.typeReqName = updateTypeReqDto.typeReqName;
            currentTypeRequest.typeReqState = updateTypeReqDto.typeReqState;
            const modifyPotition = await this.repositoryTypeRequest.save(currentTypeRequest);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeRequest_entity_1.TypeRequest, modifyPotition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async createProcessState(createTypeDto) {
        try {
            const saveProcessStateuest = await this.repositoryProcessState.save(createTypeDto);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(processState_entity_1.ProcessState, saveProcessStateuest),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAllProcessState() {
        try {
            const listProcessStateuest = await this.repositoryProcessState.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(processState_entity_1.ProcessState, listProcessStateuest),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyProcessState(id, updateProcessStateDto) {
        try {
            const currentProcessStateuest = await this.repositoryProcessState.findOne({
                where: { id: id },
            });
            if (!currentProcessStateuest) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (updateProcessStateDto.processStateName)
                currentProcessStateuest.processStateName =
                    updateProcessStateDto.processStateName;
            currentProcessStateuest.processStateState =
                updateProcessStateDto.processStateState;
            const modifyPotition = await this.repositoryProcessState.save(currentProcessStateuest);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(processState_entity_1.ProcessState, modifyPotition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async createCommunication(createTypeDto) {
        try {
            const saveTypeCommunication = await this.repositoryTypeCommunication.save(createTypeDto);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeCommunication_entity_1.TypeCommunication, saveTypeCommunication),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAllCommunication() {
        try {
            const listTypeCommunication = await this.repositoryTypeCommunication.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeCommunication_entity_1.TypeCommunication, listTypeCommunication),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyCommunication(id, updateCommunicationDto) {
        try {
            const currentTypeCommunication = await this.repositoryTypeCommunication.findOne({
                where: { id: id },
            });
            if (!currentTypeCommunication) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (updateCommunicationDto.communicationName)
                currentTypeCommunication.communicationName =
                    updateCommunicationDto.communicationName;
            currentTypeCommunication.communicationState =
                updateCommunicationDto.communicationState;
            const modifyPotition = await this.repositoryTypeCommunication.save(currentTypeCommunication);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(typeCommunication_entity_1.TypeCommunication, modifyPotition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async uploadDocument(document) {
        try {
            const req = await this.repositoryRequestHeader.findOne({
                where: {
                    id: document.requestId,
                },
                relations: ['disciplined', 'disciplined.lawyer'],
            });
            const template = await this.repositoryTemplate.findOne({
                where: {
                    templateName: document.title,
                },
            });
            let consecutive, prefix;
            const isAuto = document.documentType === 'AUTO' ||
                document.title.split(' ')[0].toUpperCase() === 'AUTO';
            if (document.state === 'Aceptado' && isAuto) {
                const { consecutive: c, prefix: p } = await this.getConsecutiveAndPrefix(template);
                consecutive = c;
                prefix = p;
                if (req.expediente === '0') {
                    const proceedingsNumber = (await this.generateProceedingsNumberV2()).data;
                    await this.repositoryRequestHeader.update(document.requestId, {
                        expediente: String(proceedingsNumber),
                    });
                }
            }
            if (!document.communicationsAndNotificationsData) {
                const nullValues = {
                    fechaComunicacionFisica: null,
                    fechaNotificacionFisica: null,
                    fechaComunicacionEmail: null,
                    fechaNotificacionEmail: null,
                };
                const disciplinados = {}, apoderados = {};
                req.disciplined.forEach((d) => {
                    var _a;
                    disciplinados[d.id] = nullValues;
                    apoderados[(_a = d.lawyer) === null || _a === void 0 ? void 0 : _a.id] = nullValues;
                });
                document.communicationsAndNotificationsData = {
                    disciplinados,
                    apoderados,
                    quejoso: nullValues,
                };
            }
            const doc = await this.repositoryDocuments.save(Object.assign(Object.assign({}, document), { consecutive: consecutive !== null && consecutive !== void 0 ? consecutive : null, prefix: prefix !== null && prefix !== void 0 ? prefix : null, request: document.requestId, documentType: template.documentType }));
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, doc),
            };
        }
        catch (err) {
            return { success: false, message: err };
        }
    }
    async getDocuments(requestId, stage) {
        try {
            const documents = await this.repositoryDocuments
                .createQueryBuilder()
                .select('documents')
                .from(document_entity_1.Documents, 'documents')
                .where('documents.id_request = :requestId AND documents.stage = :stage', { requestId: requestId, stage: stage })
                .orderBy('documents.id')
                .getMany();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, documents),
            };
        }
        catch (err) {
            return { success: false, message: err };
        }
    }
    async getAllDocumentsByRequestV2(requestId) {
        try {
            const existingDocuments = await this.repositoryDocuments.find({
                relations: ['stage'],
                where: { requestId: { id: requestId } },
                order: {
                    id: 'asc',
                },
            });
            const request = (await this.findOne(requestId)).data;
            const globalConfig = (await this.getGlobalConfig()).data;
            const templates = await this.repositoryTemplate.find({
                relations: ['requestStage'],
                order: {
                    id: 'ASC',
                },
            });
            const documents = await Promise.all(templates.map(async (template) => {
                const doc = existingDocuments.find((d) => d.title === template.templateName);
                if (doc)
                    return Object.assign(Object.assign({}, doc), { seNotificaDisciplinado: template.seNotificaDisciplinado, seNotificaQuejoso: template.seNotificaQuejoso, seComunicaDisciplinado: template.seComunicaDisciplinado, seComunicaQuejoso: template.seComunicaQuejoso, seComunicaApoderado: template.seComunicaApoderado, seNotificaApoderado: template.seNotificaApoderado });
                const templateContent = handlebars.compile(template.templateContent);
                const html = templateContent({ request, template, globalConfig });
                return {
                    requestId: requestId,
                    content: html !== null && html !== void 0 ? html : template.templateContent,
                    stage: template.requestStage,
                    order: template.order,
                    title: template.templateName,
                    state: 'Por completar',
                    consecutive: null,
                    prefix: null,
                    seNotificaDisciplinado: template.seNotificaDisciplinado,
                    seNotificaQuejoso: template.seNotificaQuejoso,
                    seComunicaDisciplinado: template.seComunicaDisciplinado,
                    seComunicaQuejoso: template.seComunicaQuejoso,
                    fechaNotificacionQuejoso: template.fechaNotificacionQuejoso,
                    fechaComunicacionQuejoso: template.fechaComunicacionQuejoso,
                    fechaComunicacionDisciplinado: template.fechaComunicacionDisciplinado,
                    fechaNotificacionDisciplinado: template.fechaNotificacionDisciplinado,
                };
            }));
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, documents),
            };
        }
        catch (err) {
            console.error(err);
            return { success: false, message: err };
        }
    }
    async calculateActualRequestState(updateRequestDto, actualRequestState, actualAssignedUserId, requestId, recursiveCalls = 0) {
        let idRequestState = actualRequestState;
        let changedAssigned = false;
        if (updateRequestDto.userAgentSelected != actualAssignedUserId &&
            recursiveCalls === 0) {
            await this.assignRequestToRole(requestId, updateRequestDto.userAgentSelected);
            changedAssigned = true;
        }
        const request = await this.repositoryRequestHeader.findOne({
            where: {
                id: requestId,
            },
        });
        switch (actualRequestState) {
            case 2: {
                if (changedAssigned) {
                    idRequestState = 3;
                }
                break;
            }
            case 3: {
                if (updateRequestDto.authorIdentified == 'no' &&
                    updateRequestDto.indagacionPrevia == 'no') {
                    idRequestState = 4;
                    let autoInhibitorio = await this.repositoryDocuments
                        .createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: 'Auto Inhibitorio 1952' })
                        .getOne();
                    if (autoInhibitorio != null &&
                        (autoInhibitorio.state === 'Completado' || autoInhibitorio.state === 'Aceptado')) {
                        idRequestState = 5;
                        await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    }
                }
                if (updateRequestDto.authorIdentified == 'no' &&
                    updateRequestDto.indagacionPrevia == 'yes') {
                    let documento = await this.repositoryDocuments
                        .createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', {
                        requestId: requestId,
                        title: 'Auto inicio indagacion previa 1952',
                    })
                        .getOne();
                    if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
                        idRequestState = 11;
                        await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    }
                    else {
                        idRequestState = 10;
                    }
                }
                if (updateRequestDto.authorIdentified == 'yes' &&
                    updateRequestDto.disciplanaryInvestigation == 'no') {
                    idRequestState = 16;
                }
                if (updateRequestDto.authorIdentified == 'yes' &&
                    updateRequestDto.disciplanaryInvestigation == 'yes') {
                    idRequestState = 29;
                }
                if (request.expediente === '0') {
                    request.expediente = (await this.generateProceedingsNumberV2()).data;
                    await this.repositoryRequestHeader.save(request);
                }
                break;
            }
            case 4: {
                let autoInhibitorio = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: 'Auto Inhibitorio 1952' })
                    .getOne();
                if (autoInhibitorio != null && (autoInhibitorio.state === 'Completado' || autoInhibitorio.state === 'Aceptado')) {
                    idRequestState = 5;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                break;
            }
            case 5: {
                let autoInhibitorio = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: 'Auto Inhibitorio 1952' })
                    .getOne();
                if (autoInhibitorio != null && autoInhibitorio.state == 'Aceptado') {
                    idRequestState = 6;
                    await this.changeRequestStage(requestId, 2);
                }
                if (autoInhibitorio != null && autoInhibitorio.state == 'Modificar') {
                    idRequestState = 4;
                }
                break;
            }
            case 6: {
                let memorando = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando oficio comunicación a quejoso de inhibitorio',
                })
                    .getOne();
                if (memorando != null && (memorando.state === 'Completado' || memorando.state === 'Aceptado')) {
                    idRequestState = 7;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                if (memorando != null && memorando.state == 'Aceptado') {
                    idRequestState = 8;
                    await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                }
                break;
            }
            case 7: {
                let memorando = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando oficio comunicación a quejoso de inhibitorio',
                })
                    .getOne();
                if (memorando != null && memorando.state == 'Aceptado') {
                    idRequestState = 8;
                    await this.changeRequestStage(requestId, 10);
                    await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                }
                if (memorando != null && memorando.state == 'Rechazado') {
                    idRequestState = 6;
                }
                break;
            }
            case 8: {
                idRequestState = 9;
                break;
            }
            case 10: {
                let documento = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Auto inicio indagacion previa 1952',
                })
                    .getOne();
                if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
                    idRequestState = 11;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                break;
            }
            case 11: {
                let documento = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Auto inicio indagacion previa 1952',
                })
                    .getOne();
                if (documento != null && documento.state == 'Aceptado') {
                    idRequestState = 12;
                    await this.changeRequestStage(requestId, 3);
                }
                if (documento != null && documento.state == 'Rechazado') {
                    idRequestState = 10;
                }
                break;
            }
            case 12: {
                let memorando = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando Oficio Comunicación Inicio Indagación Previa',
                })
                    .getOne();
                if ((memorando != null && memorando.state === 'Completado') ||
                    (memorando != null && memorando.state === 'Aceptado')) {
                    idRequestState = 13;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                break;
            }
            case 13: {
                let memorando = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando Oficio Comunicación Inicio Indagación Previa',
                })
                    .getOne();
                if (memorando != null && memorando.state == 'Aceptado') {
                    idRequestState = 14;
                }
                if (memorando != null && memorando.state == 'Rechazado') {
                    idRequestState = 12;
                }
                break;
            }
            case 14: {
                let autoVariosOrdenarPruebas = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'AUTO VARIO ORDENAR PRUEBAS_IP 1952.2',
                })
                    .getOne();
                let memorandoOficioPruebas = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando_Oficio_Solicitud de Pruebas_IP 1952.2',
                })
                    .getOne();
                if (autoVariosOrdenarPruebas != null &&
                    (autoVariosOrdenarPruebas.state === 'Completado' || autoVariosOrdenarPruebas.state === 'Aceptado') &&
                    memorandoOficioPruebas != null &&
                    (memorandoOficioPruebas.state === 'Completado' || memorandoOficioPruebas.state === 'Aceptado')) {
                    idRequestState = 15;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                break;
            }
            case 15: {
                let autoVariosOrdenarPruebas = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'AUTO VARIO ORDENAR PRUEBAS_IP 1952.2',
                })
                    .getOne();
                let memorandoOficioPruebas = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Memorando_Oficio_Solicitud de Pruebas_IP 1952.2',
                })
                    .getOne();
                if (autoVariosOrdenarPruebas != null &&
                    autoVariosOrdenarPruebas.state == 'Aceptado' &&
                    memorandoOficioPruebas != null &&
                    memorandoOficioPruebas.state == 'Aceptado') {
                    if (updateRequestDto.disciplanaryInvestigation == 'no') {
                        idRequestState = 16;
                    }
                    if (updateRequestDto.disciplanaryInvestigation == 'yes') {
                        idRequestState = 29;
                    }
                }
                if ((autoVariosOrdenarPruebas != null &&
                    autoVariosOrdenarPruebas.state == 'Rechazado') ||
                    (memorandoOficioPruebas != null &&
                        memorandoOficioPruebas.state == 'Rechazado')) {
                    idRequestState = 14;
                }
                break;
            }
            case 16: {
                let documento = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
                })
                    .getOne();
                if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
                    idRequestState = 17;
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                }
                break;
            }
            case 17: {
                let documento = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
                })
                    .getOne();
                if (documento != null && documento.state == 'Aceptado') {
                    idRequestState = 18;
                    await this.changeRequestStage(requestId, 3);
                    await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                }
                if (documento != null && documento.state == 'Rechazado') {
                    idRequestState = 16;
                }
                break;
            }
            case 18: {
                idRequestState = 19;
                break;
            }
            case 19: {
                if (updateRequestDto.recursoApelacion == 'no') {
                    idRequestState = 20;
                }
                if (updateRequestDto.recursoApelacion == 'yes') {
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    idRequestState = 22;
                }
                break;
            }
            case 20: {
                idRequestState = 21;
                break;
            }
            case 21: {
                break;
            }
            case 22: {
                await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                idRequestState = 23;
                break;
            }
            case 23: {
                if (updateRequestDto.procedeRecursoApelacion == 'no') {
                    idRequestState = 24;
                    break;
                }
                if (updateRequestDto.procedeRecursoApelacion == 'yes') {
                    idRequestState = 26;
                    break;
                }
                break;
            }
            case 24: {
                idRequestState = 25;
                break;
            }
            case 25: {
                break;
            }
            case 26: {
                idRequestState = 27;
                break;
            }
            case 27: {
                idRequestState = 28;
                break;
            }
            case 28: {
                break;
            }
            case 29: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 36;
                break;
            }
            case 30: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 31;
                break;
            }
            case 31: {
                let documento = await this.repositoryDocuments
                    .createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', {
                    requestId: requestId,
                    title: 'Auto cumplimiento de archivo de IP segunda instancia',
                })
                    .getOne();
                if (documento != null && documento.state == 'Aceptado') {
                    await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                    idRequestState = 32;
                }
                if (documento != null && documento.state == 'Rechazado') {
                    idRequestState = 30;
                }
                break;
            }
            case 32: {
                idRequestState = 33;
                break;
            }
            case 33: {
                idRequestState = 34;
                break;
            }
            case 34: {
                break;
            }
            case 35: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 36;
                break;
            }
            case 36: {
                await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                idRequestState = 37;
                break;
            }
            case 37: {
                if (updateRequestDto.confesar == 'yes') {
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    idRequestState = 38;
                    break;
                }
                if (updateRequestDto.confesar == 'no') {
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    idRequestState = 45;
                    break;
                }
                break;
            }
            case 38: {
                if (updateRequestDto.tieneApoderado == 'yes') {
                    idRequestState = 39;
                }
                if (updateRequestDto.tieneApoderado == 'no') {
                    idRequestState = 41;
                }
                break;
            }
            case 39: {
                if (updateRequestDto.procedeConfesion == 'yes') {
                    idRequestState = 40;
                }
                if (updateRequestDto.procedeConfesion == 'no') {
                    idRequestState = 45;
                }
                break;
            }
            case 40: {
                idRequestState = 75;
                break;
            }
            case 41: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 42;
                break;
            }
            case 42: {
                idRequestState = 43;
                break;
            }
            case 43: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 44;
                break;
            }
            case 44: {
                idRequestState = 39;
                break;
            }
            case 45: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 46;
                break;
            }
            case 46: {
                idRequestState = 47;
                break;
            }
            case 47: {
                await this.assignRequestToRole(requestId, 'Director de Instruccion');
                idRequestState = 48;
                break;
            }
            case 48: {
                await this.assignRequestToRole(requestId, 'Secretaria Comun de Instruccion');
                idRequestState = 49;
                break;
            }
            case 49: {
                idRequestState = 50;
                break;
            }
            case 50: {
                if (updateRequestDto.archiveDisciplanaryInvestigation == 'yes') {
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    idRequestState = 51;
                    break;
                }
                if (updateRequestDto.archiveDisciplanaryInvestigation == 'no') {
                    await this.assignRequestToRole(requestId, 'Director de Instruccion');
                    idRequestState = 70;
                    break;
                }
                break;
            }
            case 51: {
                break;
            }
            case 52: {
                break;
            }
            case 53: {
                break;
            }
            case 54: {
                break;
            }
            case 55: {
                break;
            }
            case 56: {
                break;
            }
            case 57: {
                break;
            }
            case 58: {
                break;
            }
            case 59: {
                break;
            }
            case 60: {
                break;
            }
            case 61: {
                break;
            }
            case 62: {
                break;
            }
            case 63: {
                break;
            }
            case 64: {
                break;
            }
            case 65: {
                break;
            }
            case 66: {
                break;
            }
            case 67: {
                break;
            }
            case 68: {
                break;
            }
            case 69: {
                break;
            }
            case 70: {
                break;
            }
            case 71: {
                break;
            }
            case 72: {
                break;
            }
            case 73: {
                break;
            }
            case 74: {
                break;
            }
            case 75: {
                break;
            }
            case 76: {
                break;
            }
            case 77: {
                break;
            }
            case 78: {
                break;
            }
            case 79: {
                break;
            }
            case 80: {
                break;
            }
            case 81: {
                break;
            }
            case 82: {
                break;
            }
            case 83: {
                break;
            }
            case 84: {
                break;
            }
            case 85: {
                break;
            }
            case 86: {
                break;
            }
            case 87: {
                break;
            }
            case 88: {
                break;
            }
            case 89: {
                break;
            }
            case 90: {
                break;
            }
            case 91: {
                break;
            }
            case 92: {
                break;
            }
            case 93: {
                break;
            }
            case 94: {
                break;
            }
            case 95: {
                break;
            }
            case 96: {
                break;
            }
            case 97: {
                break;
            }
            case 98: {
                break;
            }
            case 99: {
                break;
            }
            case 100: {
                break;
            }
            case 101: {
                break;
            }
            case 102: {
                break;
            }
            case 103: {
                break;
            }
            case 104: {
                break;
            }
            case 105: {
                break;
            }
            case 106: {
                break;
            }
            case 107: {
                break;
            }
            case 108: {
                break;
            }
            case 109: {
                break;
            }
            case 110: {
                break;
            }
            case 111: {
                break;
            }
            case 112: {
                break;
            }
            case 113: {
                break;
            }
            case 114: {
                break;
            }
            case 115: {
                break;
            }
            case 116: {
                break;
            }
            case 117: {
                break;
            }
            case 118: {
                break;
            }
            case 119: {
                break;
            }
            case 120: {
                break;
            }
            case 121: {
                break;
            }
            case 122: {
                break;
            }
            case 123: {
                break;
            }
            case 124: {
                break;
            }
            case 125: {
                break;
            }
            case 126: {
                break;
            }
            case 127: {
                break;
            }
            case 128: {
                break;
            }
            case 129: {
                break;
            }
            case 130: {
                break;
            }
            case 131: {
                break;
            }
            case 132: {
                break;
            }
            case 133: {
                break;
            }
            case 134: {
                break;
            }
            case 135: {
                break;
            }
            case 136: {
                break;
            }
        }
        if (recursiveCalls === 5) {
            await this.changeRequestState(requestId, idRequestState);
            return;
        }
        await this.calculateActualRequestState(updateRequestDto, idRequestState, actualAssignedUserId, requestId, ++recursiveCalls);
    }
    async changeRequestState(requestId, idRequestState) {
        let requestState = await this.repositoryRequestState.findOne({
            where: { id: idRequestState },
        });
        const currentRequest = (await this.findOne(requestId)).data;
        currentRequest.requestState = requestState;
        const { expireDate } = currentRequest;
        expireDate.setDate(expireDate.getDay() + requestState.days ? requestState.days : 0);
        currentRequest.expireDate = expireDate;
        await this.repositoryRequestHeader.save(currentRequest);
    }
    async changeRequestStage(requestId, stageId) {
        let request = (await this.findOne(requestId)).data;
        if (request) {
            let stage = await this.repositoryRequestStage.findOne({
                where: { id: stageId },
            });
            if (stage) {
                let stages = request.requestStages;
                request.requestStages = [...stages, stage];
                await this.repositoryRequestHeader.save(request);
                await this.observationsService.logObservationOrSystemLog(requestId, 'Se cambia a etapa ' + stage.stageName, null, 'system');
            }
        }
    }
    async assignRequestToRole(requestId, roleName) {
        let request = await this.repositoryRequestHeader.findOne({
            where: { id: requestId },
        });
        if (request) {
            let user = await this.usersService.getUserByRoleName(roleName);
            if (user.data) {
                request.agentSelected = user.data;
                await this.repositoryRequestHeader.save(request);
                await this.observationsService.logObservationOrSystemLog(requestId, 'Se asigna la petición a ' + user.data.userEmail, null, 'system');
                await this.notificationsService.sendEmail({
                    recipient: user.data.userEmail,
                    templateName: 'assignationTemplate',
                    data: {
                        nombre: '' + user.data.userName + ' ' + user.data.userLastName,
                        nombreQuejoso: request.nombreSolicitante,
                    },
                });
                await this.observationsService.logObservationOrSystemLog(requestId, `Se envia email a ${user.data.userEmail}`, null, 'system');
            }
            else {
                let userRole = await this.usersService.getUserById(roleName);
                if (userRole.data) {
                    request.agentSelected = userRole.data;
                    await this.repositoryRequestHeader.save(request);
                    await this.observationsService.logObservationOrSystemLog(requestId, 'Se asigna la petición a ' + userRole.data.userEmail, null, 'system');
                    await this.notificationsService.sendEmail({
                        recipient: userRole.data.userEmail,
                        templateName: 'assignationTemplate',
                        data: {
                            nombre: '' + userRole.data.userName + ' ' + userRole.data.userLastName,
                            nombreQuejoso: request.nombreSolicitante,
                        },
                    });
                    await this.observationsService.logObservationOrSystemLog(requestId, `Se envia email a ${userRole.data.userEmail}`, null, 'system');
                }
            }
        }
    }
    async generateProceedingsNumber() {
        try {
            const lastProceedingsNumber = (await this.repositoryRequestHeader
                .createQueryBuilder()
                .select('MAX(requests.expediente)')
                .from(request_entity_1.RequestHeader, 'requests')
                .getRawOne()).max;
            const proceedingsNumber = Number(lastProceedingsNumber)
                ? Number(lastProceedingsNumber) + 1
                : 6639;
            return {
                success: true,
                data: proceedingsNumber,
            };
        }
        catch (err) {
            return {
                success: true,
                message: err.message,
            };
        }
    }
    async generateProceedingsNumberV2() {
        try {
            const existingProceedingsNumber = await this.repositoryRequestHeader.find({
                select: {
                    expediente: true,
                },
                order: {
                    expediente: 'ASC',
                },
            });
            let newProceedingsNumber;
            for (let i = 0; i < existingProceedingsNumber.length - 1; i++) {
                const { expediente: current } = existingProceedingsNumber[i];
                const { expediente: next } = existingProceedingsNumber[i + 1];
                if (current === '0' || next === '0')
                    continue;
                if (Number(next) - Number(current) > 1) {
                    newProceedingsNumber = Number(current) + 1;
                    break;
                }
            }
            if (!newProceedingsNumber) {
                newProceedingsNumber =
                    Number(existingProceedingsNumber[existingProceedingsNumber.length - 1]
                        .expediente) + 1;
            }
            return {
                success: true,
                data: newProceedingsNumber,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getAllProceedingsNumber() {
        try {
            const proceedingsNumber = await this.repositoryRequestHeader.find({
                select: {
                    expediente: true,
                },
                where: {
                    expediente: (0, typeorm_2.Not)('0'),
                },
                order: {
                    expediente: 'ASC',
                },
            });
            return {
                success: true,
                data: proceedingsNumber,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getRequestByProceedingsNumber(proceedingsNumber) {
        try {
            const request = await this.repositoryRequestHeader.findOne({
                relations: [
                    'agentSelected',
                    'requestState',
                    'requestObservations',
                    'requestObservations.userCreated',
                    'requestStages',
                    'attachments',
                    'disciplined',
                ],
                where: {
                    expediente: proceedingsNumber,
                },
            });
            return {
                success: true,
                data: request,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async searchDocument(searchDocumentDto) {
        try {
            const { requestFiledStatus, requestProceedingsNumber, documentType, requestFileNumber, requestPhaseName, requestStageName, requestStateName, consecutive, } = searchDocumentDto;
            let allConsecutives;
            if (!consecutive) {
                allConsecutives = (await this.repositoryDocuments.find({
                    select: {
                        consecutive: true,
                    },
                })).map((item) => item.consecutive);
            }
            let documents = await this.repositoryDocuments.find({
                relations: ['requestId', 'requestId.requestState'],
                where: {
                    requestId: {
                        expediente: requestProceedingsNumber
                            ? requestProceedingsNumber
                            : (0, typeorm_2.Like)('%'),
                        radicado: requestFileNumber ? requestFileNumber : (0, typeorm_2.Like)('%'),
                        requestState: {
                            stateName: requestStateName ? requestStateName : (0, typeorm_2.Like)('%'),
                            faseName: requestPhaseName ? requestPhaseName : (0, typeorm_2.Like)('%'),
                            stageName: requestStageName ? requestStageName : (0, typeorm_2.Like)('%'),
                        },
                    },
                    title: documentType ? documentType : (0, typeorm_2.Like)('%'),
                    consecutive: consecutive ? consecutive : (0, typeorm_2.Any)(allConsecutives),
                },
            });
            const data = documents.map((doc) => {
                const { stateName, faseName, stageName } = doc.requestId.requestState;
                const { expediente, radicado } = doc.requestId;
                return Object.assign(Object.assign({}, doc), { stateName,
                    faseName,
                    stageName,
                    expediente,
                    radicado });
            });
            return {
                success: true,
                data: data,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getGlobalConfig() {
        try {
            const globalConfig = (await this.repositoryConfig.find())[0];
            return {
                success: true,
                data: globalConfig,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async setGlobalConfig(setGlobalConfigDto) {
        try {
            const newConfig = await this.repositoryConfig.update(1, setGlobalConfigDto);
            return {
                success: true,
                data: newConfig,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getAllRequestStates() {
        try {
            const states = await this.repositoryRequestState.find({
                relations: ['alertRoles'],
                order: {
                    id: 'ASC',
                },
            });
            return {
                success: true,
                data: states,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async modifyRequestState(modifyExpireDateDto) {
        try {
            const { stateId: id, days, isBusinessDays, alertRoles: roles, previousDays, } = modifyExpireDateDto;
            const alertRoles = (await this.usersService.getAllRoles()).data.filter((rol) => roles.includes(rol.id));
            const newState = await this.repositoryRequestState.save({
                id,
                days,
                isBusinessDays: isBusinessDays !== null && isBusinessDays !== void 0 ? isBusinessDays : false,
                alertRoles,
                previousDays: previousDays !== null && previousDays !== void 0 ? previousDays : 0,
            });
            return {
                success: true,
                data: newState,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getConsecutiveAndPrefix(template) {
        let consecutive, prefix;
        if (!template.isVario) {
            consecutive = template.consecutive + 1;
            prefix = template.prefix;
            await this.repositoryTemplate.update(template.id, {
                consecutive: consecutive,
            });
        }
        else {
            const config = await this.repositoryConfig.findOne({});
            consecutive = config.variosConsecutive + 1;
            prefix = config.prefix;
            await this.repositoryConfig.update('1', {
                variosConsecutive: consecutive,
            });
        }
        return { consecutive, prefix };
    }
    async paginate(paginateDto) {
        try {
            const { requestId, attachments } = paginateDto;
            attachments.sort((att1, att2) => {
                const dataTypeExt1 = att1.base64.split(';')[0].split(':')[1];
                const dataTypeExt2 = att2.base64.split(';')[0].split(':')[1];
                return dataTypeExt1.localeCompare(dataTypeExt2);
            });
            const folio = await pdf_lib_1.PDFDocument.create();
            await Promise.all(attachments.map(async (attachment) => {
                const [dataType, ext] = attachment.base64
                    .split(';')[0]
                    .split(':')[1]
                    .split('/');
                if (ext === 'pdf') {
                    const doc = await pdf_lib_1.PDFDocument.load(attachment.base64);
                    const pagesIndexes = Array.from({ length: doc.getPageCount() }, (_, index) => index);
                    const pages = await folio.copyPages(doc, pagesIndexes);
                    pages.forEach((page) => folio.addPage(page));
                }
                else if (dataType === 'image') {
                    let image;
                    switch (ext) {
                        case 'jpeg':
                            image = await folio.embedJpg(attachment.base64);
                            break;
                        case 'png':
                            image = await folio.embedPng(attachment.base64);
                            break;
                    }
                    if (image) {
                        const page = await folio.addPage();
                        const { width: pageWidth, height: pageHeight } = page.getSize();
                        let { width: imgWidth, height: imgHeight } = image;
                        const aspectRatio = imgWidth / imgHeight;
                        while (imgHeight > pageHeight || imgWidth > pageWidth) {
                            imgHeight /= 2;
                            imgWidth = imgHeight * aspectRatio;
                        }
                        await page.drawImage(image, {
                            height: imgHeight,
                            width: imgWidth,
                            x: 72,
                            y: pageHeight - imgHeight - 72,
                        });
                    }
                }
                else {
                    const page = await folio.addPage();
                    await page.drawText(`Archivo ${attachment.fileName}, para encontrarlo, dirijase a este link ${attachment.base64}`);
                }
            }));
            const font = await folio.embedFont(pdf_lib_1.StandardFonts.Courier);
            folio.getPages().forEach((page, index) => {
                const { width, height } = page.getSize();
                page.drawText(`${index + 1}`, {
                    x: width - 72,
                    y: height - 72,
                    size: 12,
                    font: font,
                });
            });
            const folioBase64 = await folio.saveAsBase64();
            const folioBase64Uri = `data:application/pdf;base64,${folioBase64}`;
            const req = (await this.findOne(requestId)).data;
            const currentFolio = await this.repositoryFolio.findOne({
                relations: ['requestHeader'],
                where: {
                    requestHeader: {
                        id: requestId,
                    },
                },
            });
            if (currentFolio)
                await this.repositoryFolio.delete(currentFolio.id);
            const savedFolio = await this.repositoryFolio.save({
                base64: folioBase64Uri,
                name: `folio ${req.radicado} ${req.expediente}`,
                requestHeader: req,
            });
            return {
                success: true,
                data: savedFolio,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async dashboard() {
        try {
            const quejasReparto = await this.repositoryRequestHeader.find({
                where: {
                    requestState: {
                        stageName: 'Reparto',
                    },
                    documentalTypeSelected: 'Queja',
                },
            });
            const titles = [
                'Auto Inhibitorio 1952',
                'Auto inicio indagacion previa 1952',
                'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
                'AUTO INICIO INVESTIGACIÓN DISCIPLINARIA 1952.1',
                'AUTO ARCHIVO INVESTIGACIÓN DISCIPLINARIA 1952.1',
                'AUTO CITACION AUDIENCIA Y PLIEGO DE CARGOS 1952.3',
                'AUTO DE CONTROL PREFERENTE 5221',
            ];
            const [autosInhibitorios, autosInicioIndagacionPrevia, autosArchivoIndagacionPrevia, autosInicioInvestigacionDisciplinaria, autosArchivoInvestigacionDisciplinaria, autosCitacionAudiencia, autosControlPreferente,] = await Promise.all(titles.map(async (title) => {
                return await this.repositoryDocuments.find({
                    where: {
                        title: title,
                    },
                });
            }));
            return {
                success: true,
                data: {
                    quejasReparto,
                    autosInhibitorios,
                    autosInicioIndagacionPrevia,
                    autosArchivoIndagacionPrevia,
                    autosInicioInvestigacionDisciplinaria,
                    autosArchivoInvestigacionDisciplinaria,
                    autosCitacionAudiencia,
                    autosControlPreferente,
                },
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getAllRequestStages() {
        try {
            const stages = await this.repositoryRequestStage.find();
            return {
                success: true,
                data: stages,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async getFolio(requestId) {
        try {
            const folio = await this.repositoryFolio.findOne({
                where: {
                    requestHeader: {
                        id: requestId,
                    },
                },
            });
            return {
                success: true,
                data: folio,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async testEmail() {
        await this.notificationsService.sendWhatsapp('3156276006', 'eo');
    }
    async getVariablesForTemplate(templateId) {
        try {
            const template = await this.repositoryTemplate.findOne({
                where: {
                    id: templateId,
                },
            });
            const globalConfig = (await this.getGlobalConfig()).data;
            const requestFields = (0, typeorm_2.getMetadataArgsStorage)()
                .columns.filter((column) => {
                if (column.target === request_entity_1.RequestHeader)
                    return column;
            })
                .map((column) => column.propertyName);
            const data = {
                request: requestFields,
                template: Object.keys(template).filter((key) => {
                    return !!template[key];
                }),
                globalConfig,
            };
            return {
                success: true,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async alertExpiration() {
        try {
            const requests = (await this.findAll()).data;
            for (const req of requests) {
                const daysToExpire = moment(req.expireDate).diff(moment(), 'days');
                if (daysToExpire === req.requestState.previousDays) {
                    const recipients = await Promise.all(req.requestState.alertRoles.map(async (role) => {
                        const user = await this.usersService.getUserByRoleName(role.roleName);
                        if (!user.success)
                            return;
                        return user.data;
                    }));
                    for (const user of [...recipients, req.agentSelected]) {
                        if (!user)
                            continue;
                        await this.notificationsService.sendEmail({
                            recipient: user.userEmail,
                            data: {
                                name: user.userName,
                                nombreQuejoso: req.nombreSolicitante,
                                expireDate: moment(req.expireDate).format('DD/MM/YYYY'),
                            },
                            templateName: 'alertExpiration',
                        });
                        await this.observationsService.logObservationOrSystemLog(req.id, `Se envia email a ${user.userEmail}`, null, 'system');
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    async alertState19() {
        try {
            const requests = await this.repositoryRequestHeader.find({
                where: {
                    requestState: {
                        id: 19,
                    },
                },
            });
            const state20 = await this.repositoryRequestState.findOne({
                where: {
                    id: 20,
                },
            });
            const reqsToModify = [];
            for (const request of requests) {
                if (moment().diff(moment(request.updatedAt), 'days') === 5) {
                    request.recursoApelacion = 'no';
                    request.requestState = state20;
                    reqsToModify.push(request);
                }
            }
            await this.repositoryRequestHeader.save(reqsToModify);
        }
        catch (err) {
            console.error(err);
        }
    }
    async checkPrescription() {
        try {
            const requests = (await this.findAll()).data;
            const modifiedRequests = [];
            for (const req of requests) {
                if (moment().diff(moment(req.complianceFacts), 'years') >= 5) {
                    req.enabled = false;
                    modifiedRequests.push(req);
                }
            }
            if (modifiedRequests.length > 0)
                await this.repositoryRequestHeader.save(modifiedRequests);
        }
        catch (err) {
            console.error(err);
        }
    }
    async notifyDisciplined(notifyDisciplined) {
        var _a, _b;
        try {
            const { data } = notifyDisciplined;
            for (const documentInfo of data) {
                const doc = await this.repositoryDocuments.findOne({
                    where: {
                        id: documentInfo.documentId,
                    },
                });
                const attachments = await Promise.all(documentInfo.attachmentsId.map(async (id) => {
                    return await this.repositoryAttachment.findOne({
                        where: {
                            id: id,
                        },
                    });
                }));
                for (const recipient of documentInfo.recipients) {
                    await this.notificationsService.sendEmail({
                        recipient: recipient,
                        templateName: 'notifyDisciplined',
                        data: {},
                        attachments: attachments.map((att) => {
                            return {
                                content: att.base64.split('base64,')[1],
                                encoding: 'base64',
                                filename: att.fileName,
                            };
                        }),
                    });
                    await this.observationsService.logObservationOrSystemLog((_b = (_a = attachments === null || attachments === void 0 ? void 0 : attachments[0]) === null || _a === void 0 ? void 0 : _a.requestHeader) === null || _b === void 0 ? void 0 : _b.id, `Se envia email a ${recipient}`, null, 'system');
                }
                await this.repositoryDocuments.save(Object.assign(Object.assign({}, doc), documentInfo));
            }
            return {
                success: true,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async handleOficioOrMemorando(request) {
        for (const proceedingsNumber of request.proceedingsNumbers) {
            const reqToModify = (await this.getRequestByProceedingsNumber(proceedingsNumber)).data;
            const attachmentsToAdd = request.attachments
                .filter((att1) => !reqToModify.attachments.find((att2) => att1.fileName === att2.fileName))
                .map((att) => {
                att.id = undefined;
                return Object.assign(Object.assign({}, att), { requestHeader: reqToModify });
            });
            await this.repositoryAttachment.save(attachmentsToAdd);
            await this.observationsService.logObservationOrSystemLog(reqToModify.id, `Debido al ${request.documentalTypeSelected} ${request.id}, se han agregado los siguientes archivos: ${attachmentsToAdd
                .map((att) => att.fileName)
                .join(', ')}`, null, 'system');
        }
    }
    async testSms(phoneNumber) {
        await this.notificationsService.sendSms(phoneNumber, 'Mensaje de prueba desde cid');
    }
    async pendingToNotify() {
        try {
            return await this.repositoryDocuments
                .createQueryBuilder('d')
                .select('COUNT(*), d.title')
                .where('(d.se_comunica_disciplinado = true AND d.fecha_comunicacion_disciplinado IS null) OR (d.se_notifica_disciplinado = true AND d.fecha_notificacion_disciplinado IS null) OR (d.se_comunica_quejoso = true AND d.fecha_comunicacion_quejoso IS null) OR (d.se_notifica_quejoso = true AND d.fecha_notificacion_quejoso IS null) OR (d.se_comunica_apoderado = true AND d.fecha_comunicacion_apoderado IS null) OR (d.se_notifica_apoderado = true AND d.fecha_notificacion_apoderado IS null)')
                .groupBy('d.title')
                .getRawMany();
        }
        catch (err) {
            console.error(err);
        }
    }
    async communicatedOrNotified() {
        try {
            return await this.repositoryDocuments
                .createQueryBuilder('d')
                .select('COUNT(*), d.title')
                .where('(d.se_comunica_disciplinado = true AND d.fecha_comunicacion_disciplinado IS not null) OR (d.se_notifica_disciplinado = true AND d.fecha_notificacion_disciplinado IS not null) OR (d.se_comunica_quejoso = true AND d.fecha_comunicacion_quejoso IS not null) OR (d.se_notifica_quejoso = true AND d.fecha_notificacion_quejoso IS not null) OR (d.se_comunica_apoderado = true AND d.fecha_comunicacion_apoderado IS not null) OR (d.se_notifica_apoderado = true AND d.fecha_notificacion_apoderado IS not null)')
                .groupBy('d.title')
                .getRawMany();
        }
        catch (err) {
            console.error(err);
        }
    }
    async pendingToNotifyByTitle(title) {
        try {
            return await this.repositoryDocuments.find({
                relations: [
                    'requestId',
                    'requestId.disciplined',
                    'requestId.disciplined.lawyer',
                ],
                where: [
                    {
                        title,
                        seComunicaApoderado: true,
                        fechaComunicacionApoderado: (0, typeorm_2.IsNull)(),
                    },
                    {
                        title,
                        seNotificaApoderado: true,
                        fechaNotificacionApoderado: (0, typeorm_2.IsNull)(),
                    },
                    {
                        title,
                        seComunicaDisciplinado: true,
                        fechaComunicacionDisciplinado: (0, typeorm_2.IsNull)(),
                    },
                    {
                        title,
                        seNotificaDisciplinado: true,
                        fechaNotificacionDisciplinado: (0, typeorm_2.IsNull)(),
                    },
                    {
                        title,
                        seComunicaQuejoso: true,
                        fechaComunicacionQuejoso: (0, typeorm_2.IsNull)(),
                    },
                    {
                        title,
                        seNotificaQuejoso: true,
                        fechaNotificacionQuejoso: (0, typeorm_2.IsNull)(),
                    },
                ],
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    async communicatedOrNotifiedByTitle(title) {
        try {
            return await this.repositoryDocuments.find({
                relations: [
                    'requestId',
                    'requestId.disciplined',
                    'requestId.disciplined.lawyer',
                ],
                where: [
                    {
                        title,
                        seComunicaApoderado: true,
                        fechaComunicacionApoderado: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    {
                        title,
                        seNotificaApoderado: true,
                        fechaNotificacionApoderado: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    {
                        title,
                        seComunicaDisciplinado: true,
                        fechaComunicacionDisciplinado: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    {
                        title,
                        seNotificaDisciplinado: true,
                        fechaNotificacionDisciplinado: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    {
                        title,
                        seComunicaQuejoso: true,
                        fechaComunicacionQuejoso: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    {
                        title,
                        seNotificaQuejoso: true,
                        fechaNotificacionQuejoso: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                ],
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    async attachVoucher(requestId, { base64, fileName, fileType, userType, userId, documentId, type, date }) {
        try {
            const req = await this.repositoryRequestHeader.findOne({
                where: {
                    id: requestId,
                },
            });
            const doc = await this.repositoryDocuments.findOne({
                where: {
                    id: documentId,
                },
            });
            await this.repositoryAttachment.save({
                base64,
                fileName,
                fileType,
                requestHeader: req,
            });
            const dateToModify = `fecha${type[0].toUpperCase()}${type.substring(1)}Fisica`;
            if (userType === 'quejoso') {
                doc.communicationsAndNotificationsData.quejoso[dateToModify] = date;
            }
            else if (userType === 'disciplinado') {
                doc.communicationsAndNotificationsData.disciplinados[userId][dateToModify] = date;
            }
            else {
                doc.communicationsAndNotificationsData.apoderados[dateToModify] = date;
            }
            if (type === 'notificacion') {
                if (userType === 'disciplinado') {
                    doc.fechaNotificacionDisciplinado = new Date();
                }
                else if (userType === 'apoderado') {
                    doc.fechaNotificacionApoderado = new Date();
                }
                else if (userType === 'quejoso') {
                    doc.fechaNotificacionQuejoso = new Date();
                }
            }
            else if (type === 'comunicacion') {
                if (userType === 'disciplinado') {
                    doc.fechaComunicacionDisciplinado = new Date();
                }
                else if (userType === 'apoderado') {
                    doc.fechaComunicacionApoderado = new Date();
                }
                else if (userType === 'quejoso') {
                    doc.fechaComunicacionQuejoso = new Date();
                }
            }
            await this.repositoryDocuments.save(doc);
            return {
                success: true,
            };
        }
        catch (err) {
            console.error(err);
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async notifyOrCommunicateWithEmail({ to, requestId, type, documentId, dates, }) {
        try {
            const request = await this.repositoryRequestHeader.findOne({
                where: {
                    id: requestId,
                },
                relations: ['disciplined', 'disciplined.lawyer'],
            });
            const attachments = await this.repositoryAttachment.find({
                where: {
                    requestHeader: {
                        id: requestId,
                    },
                },
            });
            const dateToModify = `fecha${type[0].toUpperCase()}${type.substring(1)}`;
            const document = await this.repositoryDocuments.findOne({
                where: {
                    id: documentId,
                },
            });
            const attachmentsToSend = attachments.map((att) => {
                return {
                    content: att.base64.split('base64,')[1],
                    encoding: 'base64',
                    filename: att.fileName,
                };
            });
            const recipients = [];
            if (to === 'disciplinados') {
                request.disciplined.forEach((d) => {
                    if (d.medioAComunicar === 'fisico' || !d.email)
                        return;
                    document.communicationsAndNotificationsData.disciplinados[d.id][`${dateToModify}Email`] = dates[d.id];
                    recipients.push({
                        name: d.name,
                        email: d.email,
                    });
                });
            }
            else if (to === 'apoderados') {
                request.disciplined.forEach((d) => {
                    const l = d.lawyer;
                    if (!l || l.medioAComunicar === 'fisico' || !l.publicDefenderEmail)
                        return;
                    document.communicationsAndNotificationsData.apoderados[l.id][`${dateToModify}Email`] = dates[l.id];
                    recipients.push({
                        name: l.publicDefenderName,
                        email: l.publicDefenderEmail,
                    });
                });
            }
            else if (to === 'quejoso') {
                if (!request.correo)
                    return;
                document.communicationsAndNotificationsData.quejoso[`${dateToModify}Email`] = dates.quejoso;
                recipients.push({
                    name: request.nombreSolicitante,
                    email: request.correo,
                });
            }
            for (const r of recipients) {
                await this.notificationsService.sendEmail({
                    recipient: r.email,
                    templateName: 'notifyDisciplined',
                    data: {
                        request,
                        recipient: r,
                        document,
                        type,
                    },
                    attachments: attachmentsToSend,
                });
            }
            if (type === 'notificacion') {
                if (to === 'disciplinados') {
                    document.fechaNotificacionDisciplinado = new Date();
                }
                else if (to === 'apoderados') {
                    document.fechaNotificacionApoderado = new Date();
                }
                else if (to === 'quejoso') {
                    document.fechaNotificacionQuejoso = new Date();
                }
            }
            else if (type === 'comunicacion') {
                if (to === 'disciplinados') {
                    document.fechaComunicacionDisciplinado = new Date();
                }
                else if (to === 'apoderados') {
                    document.fechaComunicacionApoderado = new Date();
                }
                else if (to === 'quejoso') {
                    document.fechaComunicacionQuejoso = new Date();
                }
            }
            await this.repositoryDocuments.save(document);
            return {
                success: true,
            };
        }
        catch (err) {
            console.error(err);
            return {
                success: false,
                message: err.message,
            };
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM, {
        timeZone: 'America/Bogota',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsService.prototype, "alertExpiration", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM, {
        timeZone: 'America/Bogota',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsService.prototype, "alertState19", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10AM, {
        timeZone: 'America/Bogota',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsService.prototype, "checkPrescription", null);
RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.RequestHeader)),
    __param(1, (0, typeorm_1.InjectRepository)(typeRequest_entity_1.TypeRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(processState_entity_1.ProcessState)),
    __param(3, (0, typeorm_1.InjectRepository)(typeCommunication_entity_1.TypeCommunication)),
    __param(4, (0, typeorm_1.InjectRepository)(requestDisciplined_entity_1.RequestDisciplined)),
    __param(5, (0, typeorm_1.InjectRepository)(document_entity_1.Documents)),
    __param(6, (0, typeorm_1.InjectRepository)(requestObservations_entity_1.RequestObservations)),
    __param(7, (0, typeorm_1.InjectRepository)(requestStage_entity_1.RequestStage)),
    __param(8, (0, typeorm_1.InjectRepository)(requestState_entity_1.RequestState)),
    __param(10, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __param(11, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __param(12, (0, typeorm_1.InjectRepository)(config_entity_1.Config)),
    __param(13, (0, typeorm_1.InjectRepository)(folio_entity_1.Folio)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        observations_service_1.ObservationsService,
        notifications_service_1.NotificationsService,
        axios_1.HttpService])
], RequestsService);
exports.RequestsService = RequestsService;
//# sourceMappingURL=requests.service.js.map