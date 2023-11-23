import { Attachment } from '../../attachments/entities/attachment.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PaginateDto {

  @IsNotEmpty()
  requestId: string;

  @IsNotEmpty()
  @IsArray()
  attachments: Attachment[];
}