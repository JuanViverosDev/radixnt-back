import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateRequestStageDto {
  @IsNotEmpty()  
  id: number;

  @IsNotEmpty()
  stageName: string;
}