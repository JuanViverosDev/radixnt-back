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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const notification_service_1 = require("src/notification/notification.service");
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
const typeorm_3 = require("typeorm");
const requestState_entity_1 = require("./entities/requestState.entity");
const attachment_entity_1 = require("../attachments/entities/attachment.entity");
const template_entity_1 = require("./entities/template.entity");
const observations_service_1 = require("./observations.service");
let RequestsService = class RequestsService {
    constructor(notificationService, repositoryRequestHeader, repositoryTypeRequest, repositoryProcessState, repositoryTypeCommunication, repositoryRequestDisciplined, repositoryDocuments, repositoryRequestObservations, repositoryRequestStage, repositoryRequestState, usersService, repositoryAttachment, repositoryTemplate, observationsService) {
        this.notificationService = notificationService;
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
        this.observationsService = observationsService;
    }
    async create(createRequestDto) {
        var _a;
        try {
            const initialStage = await this.repositoryRequestStage.findOne({ where: { id: 1 } });
            let initialArray = [];
            initialArray.push(initialStage);
            createRequestDto.requestStages = initialArray;
            let newState = await this.repositoryRequestState.findOne({ where: { id: 2 } });
            createRequestDto.requestState = newState;
            const userAssing = await this.usersService.getUserByRoleName("Director de Instruccion");
            console.log(userAssing);
            const userEmail = userAssing.data.userEmail;
            console.log(userEmail);
            createRequestDto.agentSelected = userAssing.data;
            createRequestDto.expediente = "0";
            const now = new Date();
            createRequestDto.expireDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay());
            const saveRequest = await this.repositoryRequestHeader.save(createRequestDto);
            await this.createInitialDocuments(saveRequest);
            await this.observationsService.logObservationOrSystemLog(saveRequest.id, 'Se creó la petición', null, 'system');
            (_a = createRequestDto.attachments) === null || _a === void 0 ? void 0 : _a.forEach(async (attachment) => {
                await this.repositoryAttachment.save(Object.assign(Object.assign({}, attachment), { requestHeader: saveRequest }));
            });
            if (createRequestDto.requestObservations.length > 0) {
                await this.observationsService.logObservationOrSystemLog(saveRequest.id, createRequestDto.requestObservations[0].content, createRequestDto.userId, 'user');
            }
            try {
                const recipients = [
                    {
                        email: userEmail,
                        name: userAssing.data.userName
                    }
                ];
                await this.notificationService.sendSendGrid(recipients, "d-bb7520d1f8824c62a3bdf85c632315c3", { "message": "Se ha creado una petición, por favor revisar en la plataforma" });
            }
            catch (error) {
                console.log("Error enviando correo");
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
    async createInitialDocuments(request) {
        let documents = [];
        await Promise.all((await this.repositoryTemplate.find({ relations: ['requestStage'] }))
            .map(async (template) => {
            const doc = {
                requestId: request,
                title: template.templateName,
                state: 'Por completar',
                content: template.templateContent,
                stage: template.requestStage,
                order: template.order
            };
            documents.push(doc);
        }));
        await this.repositoryDocuments.createQueryBuilder()
            .insert()
            .into(document_entity_1.Documents)
            .values(documents)
            .execute();
    }
    async findAll() {
        try {
            const listRequestHeader = await this.repositoryRequestHeader.find({
                relations: ['agentSelected', 'requestState', 'requestObservations', 'requestObservations.userCreated', 'requestStages', 'attachments', 'disciplined'],
                where: { id: (0, typeorm_2.Not)((0, typeorm_3.IsNull)()) }
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(request_entity_1.RequestHeader, listRequestHeader),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findRequestByUser(id) {
        try {
            const requestHeader = await this.repositoryRequestHeader.find({
                relations: ['agentSelected', 'requestState', 'requestObservations', 'requestObservations.userCreated', 'requestStages', 'attachments', 'disciplined'],
                where: { agentSelected: { id: id } },
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
                relations: ['agentSelected', 'requestState', 'requestObservations', 'requestObservations.userCreated', 'requestStages', 'attachments', 'disciplined'],
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
            await this.calculateActualRequestState(updateRequestDto, (_b = (_a = currentRequest.requestState) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 2, currentRequest.agentSelected.id, id);
            currentRequest = (await this.findOne(id)).data;
            if (updateRequestDto.radicado) {
                currentRequest.radicado = updateRequestDto.radicado;
            }
            if (updateRequestDto.expediente) {
                currentRequest.expediente = updateRequestDto.expediente;
            }
            if (updateRequestDto.nombreSolicitante) {
                currentRequest.nombreSolicitante = updateRequestDto.nombreSolicitante;
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
            if (updateRequestDto.state_id) {
                const currentState = await this.repositoryProcessState.findOneOrFail({
                    where: { id: updateRequestDto.state_id },
                });
                currentRequest.state = currentState;
            }
            (_c = updateRequestDto.disciplined) === null || _c === void 0 ? void 0 : _c.forEach(async (disciplined) => {
                await this.repositoryRequestDisciplined.save(Object.assign(Object.assign({}, disciplined), { requestHeader: currentRequest }));
            });
            if (updateRequestDto.requestObservations.length > currentRequest.requestObservations.length) {
                await this.observationsService.logObservationOrSystemLog(currentRequest.id, updateRequestDto.requestObservations[updateRequestDto.requestObservations.length - 1].content, updateRequestDto.userId, 'user');
            }
            const modifyRequest = await this.repositoryRequestHeader.save(currentRequest);
            const attachmentsReq = updateRequestDto.attachments;
            const attachmentsDb = currentRequest.attachments;
            if (attachmentsReq.length != attachmentsDb.length) {
                if (attachmentsReq.length < attachmentsDb.length) {
                    attachmentsDb === null || attachmentsDb === void 0 ? void 0 : attachmentsDb.forEach(async (attachment) => {
                        if (!attachmentsReq.find(id => id.id == attachment.id)) {
                            await this.observationsService.logObservationOrSystemLog(currentRequest.id, `El archivo ${attachment.fileName} ha sido eliminado`, null, 'system');
                            await this.repositoryAttachment.remove(attachment);
                        }
                    });
                }
                else {
                    attachmentsReq === null || attachmentsReq === void 0 ? void 0 : attachmentsReq.forEach(async (attachment) => {
                        if (!attachmentsDb.find(id => id.id == attachment.id)) {
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
            const doc = await this.repositoryDocuments.save(Object.assign(Object.assign({}, document), { request: document.requestId }));
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, doc)
            };
        }
        catch (err) {
            return { success: false, message: err };
        }
    }
    async getDocuments(requestId, stage) {
        try {
            const documents = await this.repositoryDocuments.createQueryBuilder()
                .select('documents')
                .from(document_entity_1.Documents, 'documents')
                .where('documents.id_request = :requestId AND documents.stage = :stage', { requestId: requestId, stage: stage })
                .orderBy('documents.id')
                .getMany();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, documents)
            };
        }
        catch (err) {
            return { success: false, message: err };
        }
    }
    async getAllDocumentsByRequest(requestId) {
        try {
            const documents = await this.repositoryDocuments.find({
                relations: ['stage'],
                where: { requestId: { id: requestId } },
                order: {
                    id: 'asc',
                }
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(document_entity_1.Documents, documents)
            };
        }
        catch (err) {
            return { success: false, message: err };
        }
    }
    async calculateActualRequestState(updateRequestDto, actualRequestState, actualAssignedUserId, requestId) {
        let idRequestState = actualRequestState;
        let changedAssigned = false;
        if (updateRequestDto.userAgentSelected != actualAssignedUserId) {
            await this.assignRequestToRole(requestId, updateRequestDto.userAgentSelected);
            changedAssigned = true;
        }
        switch (actualRequestState) {
            case 2: {
                if (changedAssigned) {
                    idRequestState = 3;
                }
                break;
            }
            case 3:
                {
                    if (updateRequestDto.authorIdentified == 'no' && updateRequestDto.indagacionPrevia == 'no') {
                        idRequestState = 4;
                        let autoInhibitorio = await this.repositoryDocuments.createQueryBuilder()
                            .select('documents')
                            .from(document_entity_1.Documents, 'documents')
                            .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto Inhibitorio 1952" })
                            .getOne();
                        if (autoInhibitorio != null && autoInhibitorio.state == "Completado") {
                            idRequestState = 5;
                            await this.assignRequestToRole(requestId, "Director de Instruccion");
                        }
                    }
                    if (updateRequestDto.authorIdentified == 'no' && updateRequestDto.indagacionPrevia == 'yes') {
                        let documento = await this.repositoryDocuments.createQueryBuilder()
                            .select('documents')
                            .from(document_entity_1.Documents, 'documents')
                            .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto inicio indagacion previa 1952" })
                            .getOne();
                        if (documento != null && documento.state == "Completado") {
                            idRequestState = 11;
                            await this.assignRequestToRole(requestId, "Director de Instruccion");
                        }
                        else {
                            idRequestState = 10;
                        }
                    }
                    if (updateRequestDto.authorIdentified == 'yes' && updateRequestDto.disciplanaryInvestigation == 'no') {
                        idRequestState = 16;
                    }
                    if (updateRequestDto.authorIdentified == 'yes' && updateRequestDto.disciplanaryInvestigation == 'yes') {
                        idRequestState = 29;
                    }
                    break;
                }
            case 4: {
                let autoInhibitorio = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto Inhibitorio 1952" })
                    .getOne();
                if (autoInhibitorio != null && autoInhibitorio.state == "Completado") {
                    idRequestState = 5;
                    await this.assignRequestToRole(requestId, "Director de Instruccion");
                }
                break;
            }
            case 5: {
                let autoInhibitorio = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto Inhibitorio 1952" })
                    .getOne();
                if (autoInhibitorio != null && autoInhibitorio.state == "Aceptado") {
                    idRequestState = 6;
                    await this.changeRequestStage(requestId, 2);
                }
                break;
            }
            case 6:
                {
                    let memorando = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando oficio comunicación a quejoso de inhibitorio" })
                        .getOne();
                    if (memorando != null && memorando.state == "Completado") {
                        idRequestState = 7;
                        await this.assignRequestToRole(requestId, "Director de Instruccion");
                    }
                    break;
                }
            case 7:
                {
                    let memorando = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando oficio comunicación a quejoso de inhibitorio" })
                        .getOne();
                    if (memorando != null && memorando.state == "Aceptado") {
                        idRequestState = 8;
                        await this.changeRequestStage(requestId, 10);
                        await this.assignRequestToRole(requestId, "Secretaria Comun de Instruccion");
                    }
                    break;
                }
            case 8: {
                idRequestState = 9;
                break;
            }
            case 10:
                {
                    let documento = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto inicio indagacion previa 1952" })
                        .getOne();
                    if (documento != null && documento.state == "Completado") {
                        idRequestState = 11;
                        await this.assignRequestToRole(requestId, "Director de Instruccion");
                    }
                    break;
                }
            case 11:
                {
                    let documento = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Auto inicio indagacion previa 1952" })
                        .getOne();
                    if (documento != null && documento.state == "Aceptado") {
                        idRequestState = 12;
                        await this.changeRequestStage(requestId, 3);
                    }
                    break;
                }
            case 12:
                {
                    let memorando = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando Oficio Comunicación Inicio Indagación Previa" })
                        .getOne();
                    if (memorando != null && memorando.state == "Completado") {
                        idRequestState = 13;
                        await this.assignRequestToRole(requestId, "Director de Instruccion");
                    }
                    break;
                }
            case 13:
                {
                    let memorando = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando Oficio Comunicación Inicio Indagación Previa" })
                        .getOne();
                    if (memorando != null && memorando.state == "Aceptado") {
                        idRequestState = 14;
                    }
                    break;
                }
            case 14: {
                let autoVariosOrdenarPruebas = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "AUTO VARIO ORDENAR PRUEBAS_IP 1952.2" })
                    .getOne();
                let memorandoOficioPruebas = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando_Oficio_Solicitud de Pruebas_IP 1952.2" })
                    .getOne();
                if ((autoVariosOrdenarPruebas != null && autoVariosOrdenarPruebas.state == "Completado") && (memorandoOficioPruebas != null && memorandoOficioPruebas.state == "Completado")) {
                    idRequestState = 15;
                    await this.assignRequestToRole(requestId, "Director de Instruccion");
                }
                break;
            }
            case 15: {
                let autoVariosOrdenarPruebas = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "AUTO VARIO ORDENAR PRUEBAS_IP 1952.2" })
                    .getOne();
                let memorandoOficioPruebas = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "Memorando_Oficio_Solicitud de Pruebas_IP 1952.2" })
                    .getOne();
                if ((autoVariosOrdenarPruebas != null && autoVariosOrdenarPruebas.state == "Aceptado") && (memorandoOficioPruebas != null && memorandoOficioPruebas.state == "Aceptado")) {
                    if (updateRequestDto.disciplanaryInvestigation == 'no') {
                        idRequestState = 16;
                    }
                    if (updateRequestDto.disciplanaryInvestigation == 'yes') {
                        idRequestState = 29;
                    }
                }
                break;
            }
            case 16: {
                let documento = await this.repositoryDocuments.createQueryBuilder()
                    .select('documents')
                    .from(document_entity_1.Documents, 'documents')
                    .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1" })
                    .getOne();
                if (documento != null && documento.state == "Completado") {
                    idRequestState = 17;
                    await this.assignRequestToRole(requestId, "Director de Instruccion");
                }
                break;
            }
            case 17:
                {
                    let documento = await this.repositoryDocuments.createQueryBuilder()
                        .select('documents')
                        .from(document_entity_1.Documents, 'documents')
                        .where('documents.id_request = :requestId AND documents.title = :title', { requestId: requestId, title: "AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1" })
                        .getOne();
                    if (documento != null && documento.state == "Aceptado") {
                        idRequestState = 18;
                        await this.changeRequestStage(requestId, 3);
                        await this.assignRequestToRole(requestId, "Secretaria Comun de Instruccion");
                    }
                    break;
                }
            case 18: {
                idRequestState = 19;
                break;
            }
            case 19:
                {
                    if (updateRequestDto.recursoApelacion == 'no') {
                        idRequestState = 20;
                    }
                    break;
                }
            case 20: {
                idRequestState = 21;
                break;
            }
        }
        await this.changeRequestState(requestId, idRequestState);
    }
    async changeRequestState(requestId, idRequestState) {
        let requestState = await this.repositoryRequestState.findOne({
            where: { id: idRequestState },
        });
        const currentRequest = (await this.findOne(requestId)).data;
        currentRequest.requestState = requestState;
        await this.repositoryRequestHeader.save(currentRequest);
    }
    async changeRequestStage(requestId, stageId) {
        let request = (await this.findOne(requestId)).data;
        if (request) {
            let stage = await this.repositoryRequestStage.findOne({ where: { id: stageId } });
            if (stage) {
                let stages = request.requestStages;
                request.requestStages = [...stages, stage];
                await this.repositoryRequestHeader.save(request);
                await this.observationsService.logObservationOrSystemLog(requestId, "Se cambia a etapa " + stage.stageName, null, "system");
            }
        }
    }
    async assignRequestToRole(requestId, roleName) {
        let request = await this.repositoryRequestHeader.findOne({ where: { id: requestId } });
        if (request) {
            let user = await this.usersService.getUserByRoleName(roleName);
            if (user.data) {
                request.agentSelected = user.data;
                await this.repositoryRequestHeader.save(request);
                await this.observationsService.logObservationOrSystemLog(requestId, "Se asigna la petición a " + user.data.userEmail, null, "system");
            }
            else {
                let userRole = await this.usersService.getUserById(roleName);
                if (userRole.data) {
                    request.agentSelected = userRole.data;
                    await this.repositoryRequestHeader.save(request);
                    await this.observationsService.logObservationOrSystemLog(requestId, "Se asigna la petición a " + userRole.data.userEmail, null, "system");
                }
            }
        }
    }
    async generateProceedingsNumber() {
        try {
            const lastProceedingsNumber = (await this.repositoryRequestHeader.createQueryBuilder()
                .select('MAX(requests.expediente)')
                .from(request_entity_1.RequestHeader, 'requests')
                .getRawOne()).max;
            const proceedingsNumber = lastProceedingsNumber
                ? lastProceedingsNumber + 1
                : 6639;
            return {
                success: true,
                data: proceedingsNumber
            };
        }
        catch (err) {
            return {
                success: true,
                message: err.message
            };
        }
    }
    async getAllProceedingsNumber() {
        try {
            const proceedingsNumber = await this.repositoryRequestHeader.find({
                select: {
                    expediente: true
                },
                where: {
                    expediente: (0, typeorm_2.Not)('0')
                },
                order: {
                    expediente: 'ASC'
                }
            });
            return {
                success: true,
                data: proceedingsNumber
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    async getRequestByProceedingsNumber(proceedingsNumber) {
        try {
            const request = await this.repositoryRequestHeader.findOne({
                relations: ['agentSelected', 'requestState', 'requestObservations', 'requestObservations.userCreated', 'requestStages', 'attachments', 'disciplined'],
                where: {
                    expediente: proceedingsNumber
                }
            });
            return {
                success: true,
                data: request
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
};
RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(request_entity_1.RequestHeader)),
    __param(2, (0, typeorm_1.InjectRepository)(typeRequest_entity_1.TypeRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(processState_entity_1.ProcessState)),
    __param(4, (0, typeorm_1.InjectRepository)(typeCommunication_entity_1.TypeCommunication)),
    __param(5, (0, typeorm_1.InjectRepository)(requestDisciplined_entity_1.RequestDisciplined)),
    __param(6, (0, typeorm_1.InjectRepository)(document_entity_1.Documents)),
    __param(7, (0, typeorm_1.InjectRepository)(requestObservations_entity_1.RequestObservations)),
    __param(8, (0, typeorm_1.InjectRepository)(requestStage_entity_1.RequestStage)),
    __param(9, (0, typeorm_1.InjectRepository)(requestState_entity_1.RequestState)),
    __param(11, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __param(12, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object, typeorm_2.Repository,
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
        observations_service_1.ObservationsService])
], RequestsService);
exports.RequestsService = RequestsService;
//# sourceMappingURL=requests.service.ts.BASE.js.map