import { IsOptional, IsNotEmpty, IsUUID } from "class-validator";
import { Users } from "src/users/entities/users.entity";
import { ProcessState } from "../entities/processState.entity";

export class CreateRequestDto_old {
    @IsOptional()
    @IsNotEmpty()
    numberSettled: string;
    @IsOptional()
    @IsNotEmpty()
    applicantName: string;
    @IsOptional()
    @IsNotEmpty()
    employeeFullName: string;
    @IsOptional()
    @IsNotEmpty()
    employeeDependency: string;
    @IsOptional()
    @IsNotEmpty()
    employeePosition: string;
    @IsOptional()
    @IsNotEmpty()
    employeeEmail: string;
    @IsOptional()
    @IsNotEmpty()
    employeeAddress: string;
    @IsOptional()
    @IsNotEmpty()
    fileNumber: string;
    @IsOptional()
    @IsNotEmpty()
    nameRequester: string;
    @IsOptional()
    @IsNotEmpty()
    subject: string;
    @IsUUID()
    @IsOptional()
    @IsNotEmpty()
    userReceive_id: string;
    @IsOptional()
    @IsNotEmpty()
    userReceive: Users;
    @IsOptional()
    @IsNotEmpty()
    expireDate: Date;
    @IsOptional()
    @IsNotEmpty()
    attachments: string;
    @IsOptional()
    @IsNotEmpty()
    state: ProcessState;
}
