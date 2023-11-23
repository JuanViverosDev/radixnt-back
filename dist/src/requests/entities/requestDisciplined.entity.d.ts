import { RequestHeader } from './request.entity';
import { Lawyers } from '../../config-request/entities/lawyers.entity';
export declare class RequestDisciplined {
    id: string;
    identificacion: string;
    name: string;
    primerApellido: string;
    segundoApellido: string;
    email: string;
    dependencia: string;
    cargo: string;
    isDisciplined: boolean;
    requestHeader: RequestHeader | string;
    fechaIngreso: Date;
    tipoVinculacion: string;
    tipoContrato: string;
    direccionResidencia: string;
    ciudadResidencia: string;
    nombreDptoResidencia: string;
    telefono: string;
    medioAComunicar: string;
    numeroRegistro: string;
    createdAt: Date;
    updatedAt: Date;
    lawyer: Lawyers | string;
}
