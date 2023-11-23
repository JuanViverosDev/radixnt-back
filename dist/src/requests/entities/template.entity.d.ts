import { RequestStage } from './requestStage.entity';
export declare class Template {
    id: number;
    templateName: string;
    templateContent: string;
    requestStage: RequestStage | number;
    order?: number;
    consecutive?: number;
    prefix?: string;
    isVario?: boolean;
    documentType: string;
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
