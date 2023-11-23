import { TemplatesService } from './templates.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateTemplateDto } from './../requests/dto/create-template.dto';
import { UpdateTemplateDto } from './../requests/dto/update-template.dto';
import { responseDto } from 'src/utils/dto/response.dto';
export declare class TemplatesController {
    private readonly templatesService;
    private readonly utilsService;
    constructor(templatesService: TemplatesService, utilsService: UtilsService);
    getAllTemplates(): Promise<void | responseDto>;
    createTemplate(template: CreateTemplateDto): Promise<void | responseDto>;
    updateTemplate(template: UpdateTemplateDto): Promise<void | responseDto>;
}
