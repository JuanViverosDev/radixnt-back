import { IsNotEmpty } from "class-validator";

export class CreateRequestStageDto {

  @IsNotEmpty()
  stageName: string;
}