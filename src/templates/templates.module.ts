import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './../requests/entities/template.entity';
import { RequestStage } from './../requests/entities/requestStage.entity';


@Module({
  imports:[
    TypeOrmModule.forFeature([Template, RequestStage]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService]
})
export class TemplatesModule {}