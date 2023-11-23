import { RequestObservations } from './entities/requestObservations.entity';
import { Repository } from 'typeorm';
export declare class ObservationsService {
    private readonly repositoryRequestObservations;
    constructor(repositoryRequestObservations: Repository<RequestObservations>);
    logObservationOrSystemLog(requestId: string, content: string, userCreated: string, observationType: string): Promise<void>;
}
export interface createLogOptions {
    requestId: string;
    content: string;
    userCreated?: string;
    observationType: string;
}
