import { RequestHeader } from './request.entity';
import { RequestStage } from './requestStage.entity';
export declare class Documents {
    id: string;
    requestId: RequestHeader | string;
    title: string;
    state: string;
    content: string;
    stage: RequestStage | number;
    order?: number;
    consecutive?: number;
    prefix?: string;
    documentType: string;
    seNotificaQuejoso: boolean;
    seNotificaDisciplinado: boolean;
    seComunicaQuejoso: boolean;
    seComunicaDisciplinado: boolean;
    fechaNotificacionQuejoso: Date;
    fechaNotificacionDisciplinado: Date;
    fechaComunicacionQuejoso: Date;
    fechaComunicacionDisciplinado: Date;
    fechaComunicacionFisicaDisciplinado: Date;
    fechaNotificacionFisicaDisciplinado: Date;
    seComunicaApoderado: boolean;
    seNotificaApoderado: boolean;
    fechaNotificacionApoderado: Date;
    fechaComunicacionApoderado: Date;
    communicationsAndNotificationsData: any;
}
