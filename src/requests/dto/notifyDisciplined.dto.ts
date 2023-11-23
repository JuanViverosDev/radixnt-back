import {IsArray, IsNotEmpty, IsObject} from "class-validator";
import {Attachment} from "../../attachments/entities/attachment.entity";

export class NotifyDisciplinedDto {

  @IsNotEmpty()
  @IsArray()
  data: {
    fechaComunicacionDisciplinado?: Date;
    fechaNotificacionDisciplinado?: Date;
    fechaComunicacionFisicaDisciplinado?: Date;
    fechaNotificacionFisicaDisciplinado?: Date;
    documentId: string;
    recipients: string[];
    attachmentsId: string[];
  }[];
}