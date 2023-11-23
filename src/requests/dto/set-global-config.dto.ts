import {IsNotEmpty, IsOptional} from "class-validator";

export class SetGlobalConfigDto {
  @IsNotEmpty()
  prefix: string;

  @IsNotEmpty()
  variosConsecutive: number;

  @IsOptional()
  consecutive: number;
}