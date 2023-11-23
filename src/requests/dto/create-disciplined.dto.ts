// import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { RequestHeader } from '../entities/request.entity';

export class CreateDisciplinedDto { 
   
    @IsNotEmpty()
    requestHeader: RequestHeader;

    @IsNotEmpty()
    identificacion:string;
  
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    primerApellido: string;

    @IsOptional()
    segundoApellido: string;

    @IsNotEmpty()
    email: string;
  
    @IsOptional()
    dependencia: string;

    @IsOptional()
    cargo: string;

    @IsOptional()
    isDisciplined: boolean;

    @IsOptional()
    fechaIngreso: string;

    @IsOptional()
    tipoVinculacion: string;

    @IsOptional()
    tipoContrato: string;

    @IsOptional()
    direccionResidencia: string;

    @IsOptional()
    ciudadResidencia: string;

    @IsOptional()
    nombreDptoResidencia: string;

    @IsOptional()
    telefono: string;

    @IsOptional()
    medioAComunicar: string;

    @IsOptional()
    numeroRegistro: string;

    @IsOptional()
    lawyerId: string;
}


