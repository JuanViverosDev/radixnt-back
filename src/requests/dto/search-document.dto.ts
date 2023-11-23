import {IsOptional} from "class-validator";

export class SearchDocumentDto {
  @IsOptional()
  requestPhaseName?: string;

  @IsOptional()
  requestStageName?: string;

  @IsOptional()
  requestStateName?: string;

  @IsOptional()
  requestFileNumber?: string;

  @IsOptional()
  requestProceedingsNumber?: string;

  @IsOptional()
  requestFiledStatus?: string;

  @IsOptional()
  documentType?: string;

  @IsOptional()
  consecutive?: number;
}