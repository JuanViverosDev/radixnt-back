import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestObservations } from './entities/requestObservations.entity';
import { Brackets, Not, Repository } from 'typeorm';

@Injectable()
export class ObservationsService {
    constructor(
        @InjectRepository(RequestObservations)
        private readonly repositoryRequestObservations: Repository<RequestObservations>,
    ) { }

    async logObservationOrSystemLog(
        requestId: string,
        content: string,
        userCreated: string,
        observationType: string
    ) {
        const newObservation = {
            requestId: requestId,
            content: content,
            userCreated: userCreated,
            observationType: observationType,
        };
        this.repositoryRequestObservations.save(newObservation);
    }
}


export interface createLogOptions{
    requestId: string,
    content: string,
    userCreated?: string,
    observationType: string,
}