import { IsOptional, IsNotEmpty, IsUUID, IsArray, isArray } from "class-validator";
import { Users } from "src/users/entities/users.entity";
import { ProcessState } from "../entities/processState.entity";
import { RequestObservations } from "../entities/requestObservations.entity";
import { RequestStage } from "../entities/requestStage.entity";
import { RequestState } from "../entities/requestState.entity";
import { TypeRequest } from "../entities/typeRequest.entity";
import { CreateDisciplinedDto } from "./create-disciplined.dto";
import { Attachment } from './../../attachments/entities/attachment.entity';
import {AttachmentV2} from "../../attachments-v2/entities/attachment-v2.entity";

export class CreateRequestDto {
    @IsOptional()
    userId: string;
    @IsOptional()
    radicado: string;
    @IsOptional()
    expediente: string;
    @IsOptional()
    nombreSolicitante: string;
    @IsOptional()
    calidadSolicitante: string;
    @IsOptional()
    etapa: string;
    @IsOptional()
    documentalTypeSelected: string;
    @IsOptional()
    comunicationChannelSelected: string;
    @IsOptional()
    direccionCorrespondencia: string;
    @IsOptional()
    correo: string;
    @IsOptional()
    telefono: string;
    @IsOptional()
    nombreFuncionario: string;
    @IsOptional()
    dependecia: string;
    @IsOptional()
    positionSelected: string;
    @IsOptional()
    systemState: boolean;
    @IsOptional()
    userAgentSelected: string;
    @IsOptional()
    agentSelected: Users;
    @IsOptional()
    applicantType: string;
    @IsOptional()
    applicantTypeRequest: TypeRequest;
    @IsOptional()
    subject: string;
    @IsOptional()
    authorIdentified: string;
    @IsOptional()
    indagacionPrevia: string;
    @IsOptional()
    disciplanaryInvestigation: string;
    @IsOptional()
    recursoApelacion: string;
    @IsOptional()
    procedeRecursoApelacion: string;
    @IsOptional()
    decisionEvaluacion: string;
    @IsOptional()
    continueInvestigation: string;
    @IsOptional()
    decisionSegundaInstancia: string;
    @IsOptional()
    decisionSegundaInstanciaOtros: string;
    @IsOptional()
    confesar: string;
    @IsOptional()
    tieneApoderado: string;
    @IsOptional()
    procedeConfesion: string;
    @IsOptional()
    medioJuzgamiento: string;
    @IsOptional()
    aceptaCargos: string;
    @IsOptional()
    apruebaPruebasCompletas: string;
    @IsOptional()
    apelaFallo: string;
    @IsOptional()
    presentaRecursoApelacionAutoDecisionPruebas: string;
    @IsOptional()
    concedeRecurso: string;
    @IsOptional()
    hayNulidad: string;
    @IsOptional()
    archiveDisciplanaryInvestigation: string;
    @IsOptional()
    recursoApelacionJuzgamiento: string;
    @IsOptional()
    procedeRecursoApelacionJuzgamiento: string;
    @IsOptional()
    continueInvestigationJuzgamiento: string;
    @IsOptional()
    numberSettled: string;
    @IsOptional()
    applicantName: string;
    @IsOptional()
    employeeFullName: string;
    @IsOptional()
    employeeDependency: string;
    @IsOptional()
    employeePosition: string;
    @IsOptional()
    employeeEmail: string;
    @IsOptional()
    employeeAddress: string;
    @IsOptional()
    fileNumber: string;
    @IsOptional()
    nameRequester: string;
    @IsOptional()
    userReceive: Users;
    @IsOptional()
    expireDate: Date;
    @IsOptional()
    state: ProcessState;
    @IsOptional()
    state_id: string;
    @IsOptional()
    consecutivo: number;
    @IsOptional()
    @IsArray()
    disciplined: CreateDisciplinedDto[];
    @IsOptional()
    requestState: RequestState;
    @IsOptional()
    @IsArray()
    requestObservations: RequestObservations[];

    @IsOptional()
    @IsArray()
    requestStages: RequestStage[];

    @IsOptional()
    @IsArray()
    attachments: Attachment[];

    @IsOptional()
    @IsArray()
    attachmentsV2: AttachmentV2[];

    @IsOptional()
    s3Folder: string;

    @IsOptional()
    proceedingsNumbers: string[];

    @IsOptional()
    cedulaSolicitante: string;
}

