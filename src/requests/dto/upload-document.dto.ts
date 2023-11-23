import {IsNotEmpty, IsOptional, IsUUID} from "class-validator";

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  requestId: string;
  
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  state: string;
  
  @IsNotEmpty()
  content: string;
  
  @IsNotEmpty()
  stage: number;

  id?: string;

  @IsOptional()
  documentType?: string;

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
  communicationsAndNotificationsData: any;
}