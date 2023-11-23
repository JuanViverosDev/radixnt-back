import { Users } from '../../users/entities/users.entity';
import { ProcessState } from './processState.entity';
export declare class RequestHeader_old {
    id: string;
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
    userReceive: Users;
    expireDate: Date;
    attachments: string;
    state: ProcessState;
    createdAt: Date;
    updatedAt: Date;
}
