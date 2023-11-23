import { RequestStage } from "../entities/requestStage.entity";
export declare class UpdateTemplateDto {
    id: number;
    templateName: string;
    templateContent: string;
    requestStage: RequestStage;
    order?: number;
    seNotificaQuejoso: boolean;
    seNotificaDisciplinado: boolean;
    seComunicaQuejoso: boolean;
    seComunicaDisciplinado: boolean;
    fechaNotificacionQuejoso: Date;
    fechaNotificacionDisciplinado: Date;
    fechaComunicacionQuejoso: Date;
    fechaComunicacionDisciplinado: Date;
    seComunicaApoderado: boolean;
    seNotificaApoderado: boolean;
    fechaNotificacionApoderado: Date;
    fechaComunicacionApoderado: Date;
}
