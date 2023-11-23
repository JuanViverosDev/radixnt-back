import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { RequestStage } from "../entities/requestStage.entity";

export class UpdateTemplateDto {
 
  @IsNotEmpty()
  id: number;
  
  @IsOptional()
  templateName: string;

  @IsOptional()
  templateContent: string;

  @IsOptional()
  requestStage: RequestStage;

  @IsOptional()
  order?: number;

  @IsOptional()
  seNotificaQuejoso: boolean;

  @IsOptional()
  seNotificaDisciplinado: boolean;

  @IsOptional()
  seComunicaQuejoso: boolean;

  @IsOptional()
  seComunicaDisciplinado: boolean;

  @IsOptional()
  fechaNotificacionQuejoso: Date;

  @IsOptional()
  fechaNotificacionDisciplinado: Date;

  @IsOptional()
  fechaComunicacionQuejoso: Date;

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