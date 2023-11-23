import { RequestStage } from "../entities/requestStage.entity";
export declare class CreateTemplateDto {
    templateName: string;
    templateContent: string;
    requestStage: RequestStage | number;
    order: number;
    isVario: boolean;
    consecutive?: number;
    prefix?: string;
    documentType?: string;
    seNotificaQuejoso: boolean;
    seComunicaQuejoso: boolean;
    fechaNotificacionQuejoso: Date;
    fechaComunicacionQuejoso: Date;
    seComunicaDisciplinado: boolean;
    seNotificaDisciplinado: boolean;
    fechaNotificacionDisciplinado: Date;
    fechaComunicacionDisciplinado: Date;
    seComunicaApoderado: boolean;
    seNotificaApoderado: boolean;
    fechaNotificacionApoderado: Date;
    fechaComunicacionApoderado: Date;
}
