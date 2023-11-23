import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/auth.guard';
import { TemplatesService } from './templates.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateTemplateDto } from './../requests/dto/create-template.dto';
import { UpdateTemplateDto } from './../requests/dto/update-template.dto';
import { responseDto } from 'src/utils/dto/response.dto';

@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly utilsService: UtilsService
  ) { }

  @Get('')
  // @UseGuards(FirebaseAuthGuard)
  async getAllTemplates() {
    const response: responseDto = await this.templatesService.getAllTemplates();
    if (!response.success) return this.utilsService.handleError(response)
    return response;
  }

  @Post('')
  // @UseGuards(FirebaseAuthGuard)
  async createTemplate(@Body() template: CreateTemplateDto) {
    const response: responseDto = await this.templatesService.createTemplate(template);
    if (!response.success) return this.utilsService.handleError(response)
    return response;
  }

  @Patch('')
  async updateTemplate(@Body() template: UpdateTemplateDto) {
    const response: responseDto = await this.templatesService.updateTemplate(template);
    if (!response.success) return this.utilsService.handleError(response)
    return response;
  }
}