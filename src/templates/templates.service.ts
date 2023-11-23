import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateTemplateDto } from './../requests/dto/create-template.dto';
import { UpdateTemplateDto } from './../requests/dto/update-template.dto';

import { Template } from './../requests/entities/template.entity';
import { RequestStage } from './../requests/entities/requestStage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    @InjectRepository(RequestStage)
    private readonly requestsStageRepository: Repository<RequestStage>
  ) { }

  async getAllTemplates() {
    try {
      const templates = await this.templatesRepository.find({
        relations: ['requestStage'],
        order: {
          requestStage: {
            id: 'ASC'
          }
        }
      })
      return {
        success: true,
        data: templates
      }
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }

  async createTemplate(template: CreateTemplateDto) {
    try {
      const lastKey = (await this.templatesRepository.createQueryBuilder()
        .select('MAX(templates.id)')
        .from(Template, 'templates') // ? Movida random que tuve que hacer pq la PK estaba desincronizada ._.
        .getRawOne()).max
      const newTemplate = await this.templatesRepository.save({
        ...template,
        id: lastKey + 1
      })
      return {
        success: true,
        data: newTemplate
      }
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }

  async updateTemplate(template: UpdateTemplateDto) {
    try {
      const updatedTemplate = await this.templatesRepository.save(template)
      return {
        success: true,
        data: updatedTemplate
      }
    } catch (err) {
      return {
        success: false,
        message: err.message
      }
    }
  }
}