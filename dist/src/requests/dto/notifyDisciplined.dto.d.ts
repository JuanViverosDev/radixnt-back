export declare class NotifyDisciplinedDto {
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
