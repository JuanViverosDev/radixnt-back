import { IsNotEmpty, IsOptional } from "class-validator";

enum UserTypes {
  quejoso = 'quejoso',
  disciplinado = 'disciplinado',
  apoderado = 'apoderado'
}

enum Types {
  comunicacion = 'comunicacion',
  notificacion = 'notificacion'
}

export class AttachVoucherDto {
  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  base64: string;
  
  @IsNotEmpty()
  fileName: string;
  
  @IsNotEmpty()
  fileType: string;
  
  @IsNotEmpty()
  userType: UserTypes;
  
  @IsOptional()
  userId?: string;

  @IsNotEmpty()
  type: Types;

  @IsNotEmpty()
  date: string;
}