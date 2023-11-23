import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeRequest } from './entities/typeRequest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessState } from './entities/processState.entity';
import { TypeCommunication } from './entities/typeCommunication.entity';
import { RequestHeader } from './entities/request.entity';
import { UsersModule } from 'src/users/users.module';
import { RequestDisciplined } from './entities/requestDisciplined.entity';
import { Documents } from './entities/document.entity';
import { RequestState } from './entities/requestState.entity';
import { RequestObservations } from './entities/requestObservations.entity';
import { RequestStage } from './entities/requestStage.entity';
import { Template } from './entities/template.entity';
import { Attachment } from './../attachments/entities/attachment.entity';
import { ObservationsService } from './observations.service';
import { Config } from './entities/config.entity';
import { Folio } from './entities/folio.entity';
import { HttpModule } from '@nestjs/axios';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      TypeRequest,
      ProcessState,
      TypeCommunication,
      RequestHeader,
      RequestDisciplined,
      Documents,
      RequestState,
      RequestObservations,
      RequestStage,
      Template,
      Attachment,
      Config,
      Folio,
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, ObservationsService],
})
export class RequestsModule {}
