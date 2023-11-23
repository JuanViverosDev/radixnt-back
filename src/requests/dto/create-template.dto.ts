import {IsNotEmpty, IsOptional} from "class-validator";
import { RequestStage } from "../entities/requestStage.entity";
import {Column} from "typeorm";

export class CreateTemplateDto {

  @IsNotEmpty()
  templateName: string;

  @IsNotEmpty()
  templateContent: string;

  @IsNotEmpty()
  requestStage: RequestStage | number;

  @IsOptional()
  order: number;

  @IsNotEmpty()
  isVario: boolean;

  @IsOptional()
  consecutive?: number;

  @IsOptional()
  prefix?: string;

  @IsOptional()
  documentType?: string;

  @IsOptional()
  seNotificaQuejoso: boolean;

  @IsOptional()
  seComunicaQuejoso: boolean;

  @IsOptional()
  fechaNotificacionQuejoso: Date;

  @IsOptional()
  fechaComunicacionQuejoso: Date;

  @IsOptional()
  seComunicaDisciplinado: boolean;

  @IsOptional()
  seNotificaDisciplinado: boolean;

  @IsOptional()
  fechaNotificacionDisciplinado: Date;

  @IsOptional()
  fechaComunicacionDisciplinado: Date;

  @IsOptional()
  seComunicaApoderado: boolean;

  @IsOptional()
  seNotificaApoderado: boolean;

  @IsOptional()
  fechaNotificacionApoderado: Date;

  @IsOptional()
  fechaComunicacionApoderado: Date;
}