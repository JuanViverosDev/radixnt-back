import {IsNotEmpty, IsOptional} from "class-validator";
import { Roles } from "src/users/entities/roles.entity";

export class ModifyExpireDateDto {
  @IsNotEmpty()
  days: number;

  @IsOptional()
  isBusinessDays: boolean;

  @IsNotEmpty()
  stateId: number;

  @IsOptional()
  previousDays: number

  @IsNotEmpty()
  alertRoles: string[];
}