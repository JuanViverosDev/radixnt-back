declare enum UserTypes {
    quejoso = "quejoso",
    disciplinado = "disciplinado",
    apoderado = "apoderado"
}
declare enum Types {
    comunicacion = "comunicacion",
    notificacion = "notificacion"
}
export declare class AttachVoucherDto {
    documentId: string;
    base64: string;
    fileName: string;
    fileType: string;
    userType: UserTypes;
    userId?: string;
    type: Types;
    date: string;
}
export {};
