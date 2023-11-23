import { Users } from "src/users/entities/users.entity";
import { ProcessState } from "../entities/processState.entity";
export declare class CreateRequestDto_old {
    numberSettled: string;
    applicantName: string;
    employeeFullName: string;
    employeeDependency: string;
    employeePosition: string;
    employeeEmail: string;
    employeeAddress: string;
    fileNumber: string;
    nameRequester: string;
    subject: string;
    userReceive_id: string;
    userReceive: Users;
    expireDate: Date;
    attachments: string;
    state: ProcessState;
}
