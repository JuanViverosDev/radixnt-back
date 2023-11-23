import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateTypeReqDto } from './dto/create-typereq.dto';
import { UpdateTypeReqDto } from './dto/update-typereq.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { CreateProcessStateDto } from './dto/create-processState.dto';
import { UpdateProcessStateDto } from './dto/update-processState.dto';
import { CreateCommunicationDto } from './dto/create-typecommunication.dto';
import { UpdateCommunicationDto } from './dto/update-typecommunication.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { responseDto } from 'src/utils/dto/response.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { SearchDocumentDto } from './dto/search-document.dto';
import { SetGlobalConfigDto } from './dto/set-global-config.dto';
import { ModifyExpireDateDto } from './dto/modify-expire-date.dto';
import { PaginateDto } from './dto/paginate.dto';
import { NotifyDisciplinedDto } from './dto/notifyDisciplined.dto';
import { NotifyOrCommunicateDto } from './dto/notify-or-communicate.dto';
import { AttachVoucherDto } from './dto/attach-voucher.dto';
export declare class RequestsController {
    private readonly requestsService;
    private readonly utilsService;
    private readonly usersService;
    constructor(requestsService: RequestsService, utilsService: UtilsService, usersService: UsersService);
    create(createRequestDto: CreateRequestDto): Promise<void | responseDto>;
    findAll(req: any): Promise<void | responseDto>;
    findRequestByUser(req: any, param: ParamUuidDto): Promise<void | responseDto>;
    findOne(param: ParamUuidDto): Promise<void | responseDto>;
    update(param: ParamUuidDto, updateRequestDto: UpdateRequestDto): Promise<void | responseDto>;
    createTypeReq(createRequestDto: CreateTypeReqDto): Promise<void | responseDto>;
    findAllTypeReq(): Promise<void | responseDto>;
    updateTypeReq(param: ParamUuidDto, updateRequestDto: UpdateTypeReqDto): Promise<void | responseDto>;
    createProcessState(createRequestDto: CreateProcessStateDto): Promise<void | responseDto>;
    findAllProcessState(): Promise<void | responseDto>;
    updateProcessState(param: ParamUuidDto, updateRequestDto: UpdateProcessStateDto): Promise<void | responseDto>;
    createCommunication(createRequestDto: CreateCommunicationDto): Promise<void | responseDto>;
    findAllCommunication(): Promise<void | responseDto>;
    updateCommunication(param: ParamUuidDto, updateRequestDto: UpdateCommunicationDto): Promise<void | responseDto>;
    uploadDocument(uploadDocumentDto: UploadDocumentDto): Promise<void | responseDto>;
    getDocuments(requestId: string, stage: string): Promise<void | responseDto>;
    getDocumentsByRequest(requestId: string): Promise<void | responseDto>;
    generateProceedingsNumber(): Promise<void | responseDto>;
    getAllProceedingsNumber(): Promise<void | responseDto>;
    testStage(requestId: string, stageId: number): Promise<void>;
    testAssign(requestId: string, roleName: string): Promise<void>;
    getRequestByProceedingsNumber(proceedingsNumber: string): Promise<void | responseDto>;
    searchDocument(searchDocumentDto: SearchDocumentDto): Promise<void | responseDto>;
    setGlobalConfig(setGlobalConfigDto: SetGlobalConfigDto): Promise<void | responseDto>;
    getGlobalConfig(): Promise<void | responseDto>;
    getAllRequestStates(): Promise<void | responseDto>;
    modifyState(modifyExpireDateDto: ModifyExpireDateDto): Promise<void | responseDto>;
    paginate(paginate: PaginateDto): Promise<void | responseDto>;
    dashboard(): Promise<void | responseDto>;
    getAllRequestStages(): Promise<void | responseDto>;
    getFolio(requestId: string): Promise<void | responseDto>;
    email(): Promise<void>;
    getVariablesForTemplate(templateId: number): Promise<void | responseDto>;
    notifyDisciplined(notifyDisciplinedDto: NotifyDisciplinedDto): Promise<void | responseDto>;
    testSMS(phoneNumber: string): Promise<void>;
    pendingToNotify(): Promise<any[]>;
    notificationsPanel(): Promise<{
        pending: any[];
        inProgressOrCompleted: any[];
    }>;
    pendingToNotifyByTitle(title: string): Promise<import("./entities/document.entity").Documents[]>;
    communicatedOrNotifiedByTitle(title: string): Promise<import("./entities/document.entity").Documents[]>;
    notifyOrCommunicate(notifyOrCommunicateDto: NotifyOrCommunicateDto): Promise<void | responseDto>;
    attachVoucher(requestId: string, data: AttachVoucherDto): Promise<void | responseDto>;
}
