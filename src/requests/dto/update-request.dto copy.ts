import { IsOptional, IsUUID } from "class-validator";
import { Users } from "src/users/entities/users.entity";
import { ProcessState } from "../entities/processState.entity";

export class UpdateRequestDto_old{
    @IsOptional()
    numberSettled: string;
    @IsOptional()
    applicantName: string;
    @IsOptional()
    employeeFullName: string;
    @IsOptional()
    employeeDependency: string;
    @IsOptional()
    employeePosition: string;
    @IsOptional()
    employeeEmail: string;
    @IsOptional()
    employeeAddress: string;
    @IsOptional()
    fileNumber: string;
    @IsOptional()
    nameRequester: string;
    @IsOptional()
    subject: string;
    @IsUUID()
    @IsOptional()
    userReceive_id: string;
    @IsOptional()
    userReceive: Users;
    @IsOptional()
    expireDate: Date;
    @IsOptional()
    attachments: string;
    @IsUUID()
    @IsOptional()
    state_id: string;
    @IsOptional()
    state: ProcessState;
}
