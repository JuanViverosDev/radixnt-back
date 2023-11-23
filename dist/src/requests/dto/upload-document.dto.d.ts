export declare class UploadDocumentDto {
    requestId: string;
    title: string;
    state: string;
    content: string;
    stage: number;
    id?: string;
    documentType?: string;
    seNotificaQuejoso: boolean;
    seNotificaDisciplinado: boolean;
    seComunicaQuejoso: boolean;
    seComunicaDisciplinado: boolean;
    fechaNotificacionQuejoso: Date;
    fechaNotificacionDisciplinado: Date;
    fechaComunicacionQuejoso: Date;
    fechaComunicacionDisciplinado: Date;
    communicationsAndNotificationsData: any;
}
