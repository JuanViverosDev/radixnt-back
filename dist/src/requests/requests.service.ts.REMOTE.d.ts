import { NotificationService } from 'src/notification/notification.service';
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
import { Config } from "./entities/config.entity";
export declare class RequestsService {
    private readonly notificationService;
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
    private readonly observationsService;
    constructor(notificationService: NotificationService, repositoryRequestHeader: Repository<RequestHeader>, repositoryTypeRequest: Repository<TypeRequest>, repositoryProcessState: Repository<ProcessState>, repositoryTypeCommunication: Repository<TypeCommunication>, repositoryRequestDisciplined: Repository<RequestDisciplined>, repositoryDocuments: Repository<Documents>, repositoryRequestObservations: Repository<RequestObservations>, repositoryRequestStage: Repository<RequestStage>, repositoryRequestState: Repository<RequestState>, usersService: UsersService, repositoryAttachment: Repository<Attachment>, repositoryTemplate: Repository<Template>, repositoryConfig: Repository<Config>, observationsService: ObservationsService);
    create(createRequestDto: CreateRequestDto): Promise<{
        success: boolean;
        data: RequestHeader;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createInitialDocuments(request: RequestHeader): Promise<void>;
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
    getAllDocumentsByRequest(requestId: string): Promise<responseDto>;
    getAllDocumentsByRequestV2(requestId: string): Promise<responseDto>;
    calculateActualRequestState(updateRequestDto: UpdateRequestDto, actualRequestState: number, actualAssignedUserId: string, requestId: string): Promise<void>;
    changeRequestState(requestId: string, idRequestState: number): Promise<void>;
    changeRequestStage(requestId: string, stageId: number): Promise<void>;
    assignRequestToRole(requestId: string, roleName: string): Promise<void>;
    generateProceedingsNumber(): Promise<{
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
}
