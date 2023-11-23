import { IsNotEmpty, IsOptional } from "class-validator";
import { Attachment } from "src/attachments/entities/attachment.entity";

export class NotifyOrCommunicateDto {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  requestId: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  templateId?: string;

  @IsNotEmpty()
  documentId: string;

  @IsOptional()
  dates: any;
}