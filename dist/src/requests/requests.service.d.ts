import { responseDto } from 'src/utils/dto/response.dto';
import { Repository } from 'typeorm';
import { CreateProcessStateDto } from './dto/create-processState.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateCommunicationDto } from './dto/create-typecommunication.dto';
import { CreateTypeReqDto } from './dto/create-typereq.dto';
import { UpdateProcessStateDto } from './dto/update-processState.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UpdateCommunicationDto } from './dto/update-typecommunication.dto';
import { UpdateTypeReqDto } from './dto/update-typereq.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ProcessState } from './entities/processState.entity';
import { RequestHeader } from './entities/request.entity';
import { RequestDisciplined } from './entities/requestDisciplined.entity';
import { TypeCommunication } from './entities/typeCommunication.entity';
import { TypeRequest } from './entities/typeRequest.entity';
import { Documents } from './entities/document.entity';
import { RequestObservations } from './entities/requestObservations.entity';
import { RequestStage } from './entities/requestStage.entity';
import { UsersService } from 'src/users/users.service';
import { RequestState } from './entities/requestState.entity';
import { Attachment } from 'src/attachments/entities/attachment.entity';
import { Template } from './entities/template.entity';
import { ObservationsService } from './observations.service';
import { Config } from './entities/config.entity';
import { SearchDocumentDto } from './dto/search-document.dto';
import { SetGlobalConfigDto } from './dto/set-global-config.dto';
import { ModifyExpireDateDto } from './dto/modify-expire-date.dto';
import { PaginateDto } from './dto/paginate.dto';
import { Folio } from './entities/folio.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifyDisciplinedDto } from './dto/notifyDisciplined.dto';
import { HttpService } from '@nestjs/axios';
import { NotifyOrCommunicateDto } from './dto/notify-or-communicate.dto';
import { AttachVoucherDto } from './dto/attach-voucher.dto';
export declare class RequestsService {
    private readonly repositoryRequestHeader;
    private readonly repositoryTypeRequest;
    private readonly repositoryProcessState;
    private readonly repositoryTypeCommunication;
    private readonly repositoryRequestDisciplined;
    private readonly repositoryDocuments;
    private readonly repositoryRequestObservations;
    private readonly repositoryRequestStage;
    private readonly repositoryRequestState;
    private readonly usersService;
    private readonly repositoryAttachment;
    private readonly repositoryTemplate;
    private readonly repositoryConfig;
    private readonly repositoryFolio;
    private readonly observationsService;
    private readonly notificationsService;
    private readonly httpService;
    constructor(repositoryRequestHeader: Repository<RequestHeader>, repositoryTypeRequest: Repository<TypeRequest>, repositoryProcessState: Repository<ProcessState>, repositoryTypeCommunication: Repository<TypeCommunication>, repositoryRequestDisciplined: Repository<RequestDisciplined>, repositoryDocuments: Repository<Documents>, repositoryRequestObservations: Repository<RequestObservations>, repositoryRequestStage: Repository<RequestStage>, repositoryRequestState: Repository<RequestState>, usersService: UsersService, repositoryAttachment: Repository<Attachment>, repositoryTemplate: Repository<Template>, repositoryConfig: Repository<Config>, repositoryFolio: Repository<Folio>, observationsService: ObservationsService, notificationsService: NotificationsService, httpService: HttpService);
    create(createRequestDto: CreateRequestDto): Promise<{
        success: boolean;
        data: RequestHeader;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createInitialDocumentsV2(request: RequestHeader): Promise<void>;
    findAll(): Promise<{
        success: boolean;
        data: RequestHeader[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findRequestByUser(id: string): Promise<{
        success: boolean;
        data: RequestHeader[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: RequestHeader;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    update(id: string, updateRequestDto: UpdateRequestDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: RequestHeader;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    modifyStateRequest(id: string, state: string): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: RequestHeader;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    createTypeReq(createTypeDto: CreateTypeReqDto): Promise<{
        success: boolean;
        data: TypeRequest;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAllTypeReq(): Promise<{
        success: boolean;
        data: TypeRequest[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyTypeReq(id: string, updateTypeReqDto: UpdateTypeReqDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: TypeRequest;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    createProcessState(createTypeDto: CreateProcessStateDto): Promise<{
        success: boolean;
        data: ProcessState;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAllProcessState(): Promise<{
        success: boolean;
        data: ProcessState[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyProcessState(id: string, updateProcessStateDto: UpdateProcessStateDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: ProcessState;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    createCommunication(createTypeDto: CreateCommunicationDto): Promise<{
        success: boolean;
        data: TypeCommunication;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAllCommunication(): Promise<{
        success: boolean;
        data: TypeCommunication[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyCommunication(id: string, updateCommunicationDto: UpdateCommunicationDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: TypeCommunication;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    uploadDocument(document: UploadDocumentDto): Promise<responseDto>;
    getDocuments(requestId: string, stage: string): Promise<responseDto>;
    getAllDocumentsByRequestV2(requestId: string): Promise<responseDto>;
    calculateActualRequestState(updateRequestDto: UpdateRequestDto, actualRequestState: number, actualAssignedUserId: string, requestId: string, recursiveCalls?: number): Promise<void>;
    changeRequestState(requestId: string, idRequestState: number): Promise<void>;
    changeRequestStage(requestId: string, stageId: number): Promise<void>;
    assignRequestToRole(requestId: string, roleName: string): Promise<void>;
    generateProceedingsNumber(): Promise<{
        success: boolean;
        data: number;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    generateProceedingsNumberV2(): Promise<{
        success: boolean;
        data: any;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAllProceedingsNumber(): Promise<{
        success: boolean;
        data: RequestHeader[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getRequestByProceedingsNumber(proceedingsNumber: string): Promise<{
        success: boolean;
        data: RequestHeader;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    searchDocument(searchDocumentDto: SearchDocumentDto): Promise<{
        success: boolean;
        data: {
            stateName: string;
            faseName: string;
            stageName: string;
            expediente: string;
            radicado: string;
            id: string;
            requestId: string | RequestHeader;
            title: string;
            state: string;
            content: string;
            stage: number | RequestStage;
            order?: number;
            consecutive?: number;
            prefix?: string;
            documentType: string;
            seNotificaQuejoso: boolean;
            seNotificaDisciplinado: boolean;
            seComunicaQuejoso: boolean;
            seComunicaDisciplinado: boolean;
            fechaNotificacionQuejoso: Date;
            fechaNotificacionDisciplinado: Date;
            fechaComunicacionQuejoso: Date;
            fechaComunicacionDisciplinado: Date;
            fechaComunicacionFisicaDisciplinado: Date;
            fechaNotificacionFisicaDisciplinado: Date;
            seComunicaApoderado: boolean;
            seNotificaApoderado: boolean;
            fechaNotificacionApoderado: Date;
            fechaComunicacionApoderado: Date;
            communicationsAndNotificationsData: any;
        }[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getGlobalConfig(): Promise<{
        success: boolean;
        data: Config;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    setGlobalConfig(setGlobalConfigDto: SetGlobalConfigDto): Promise<{
        success: boolean;
        data: import("typeorm").UpdateResult;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAllRequestStates(): Promise<{
        success: boolean;
        data: RequestState[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    modifyRequestState(modifyExpireDateDto: ModifyExpireDateDto): Promise<{
        success: boolean;
        data: {
            id: number;
            days: number;
            isBusinessDays: boolean;
            alertRoles: import("../users/entities/roles.entity").Roles[];
            previousDays: number;
        } & RequestState;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getConsecutiveAndPrefix(template: Template): Promise<{
        consecutive: any;
        prefix: any;
    }>;
    paginate(paginateDto: PaginateDto): Promise<{
        success: boolean;
        data: {
            base64: string;
            name: string;
            requestHeader: RequestHeader;
        } & Folio;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    dashboard(): Promise<{
        success: boolean;
        data: {
            quejasReparto: RequestHeader[];
            autosInhibitorios: Documents[];
            autosInicioIndagacionPrevia: Documents[];
            autosArchivoIndagacionPrevia: Documents[];
            autosInicioInvestigacionDisciplinaria: Documents[];
            autosArchivoInvestigacionDisciplinaria: Documents[];
            autosCitacionAudiencia: Documents[];
            autosControlPreferente: Documents[];
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getAllRequestStages(): Promise<{
        success: boolean;
        data: RequestStage[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getFolio(requestId: string): Promise<{
        success: boolean;
        data: Folio;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    testEmail(): Promise<void>;
    getVariablesForTemplate(templateId: number): Promise<{
        success: boolean;
        data: {
            request: string[];
            template: string[];
            globalConfig: Config;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    alertExpiration(): Promise<void>;
    alertState19(): Promise<void>;
    checkPrescription(): Promise<void>;
    notifyDisciplined(notifyDisciplined: NotifyDisciplinedDto): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    handleOficioOrMemorando(request: RequestHeader): Promise<void>;
    testSms(phoneNumber: string): Promise<void>;
    pendingToNotify(): Promise<any[]>;
    communicatedOrNotified(): Promise<any[]>;
    pendingToNotifyByTitle(title: string): Promise<Documents[]>;
    communicatedOrNotifiedByTitle(title: string): Promise<Documents[]>;
    attachVoucher(requestId: string, { base64, fileName, fileType, userType, userId, documentId, type, date }: AttachVoucherDto): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    notifyOrCommunicateWithEmail({ to, requestId, type, documentId, dates, }: NotifyOrCommunicateDto): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
}
