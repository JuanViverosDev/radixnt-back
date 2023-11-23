import { RequestHeader } from '../entities/request.entity';
export declare class CreateDisciplinedDto {
    requestHeader: RequestHeader;
    identificacion: string;
    name: string;
    primerApellido: string;
    segundoApellido: string;
    email: string;
    dependencia: string;
    cargo: string;
    isDisciplined: boolean;
    fechaIngreso: string;
    tipoVinculacion: string;
    tipoContrato: string;
    direccionResidencia: string;
    ciudadResidencia: string;
    nombreDptoResidencia: string;
    telefono: string;
    medioAComunicar: string;
    numeroRegistro: string;
    lawyerId: string;
}
