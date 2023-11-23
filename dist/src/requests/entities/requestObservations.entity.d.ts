import { RequestHeader } from './request.entity';
import { Users } from '../../users/entities/users.entity';
export declare class RequestObservations {
    id: string;
    requestId: RequestHeader | string;
    content: string;
    createdAt: Date;
    userCreated: Users | string;
    observationType: string;
}
