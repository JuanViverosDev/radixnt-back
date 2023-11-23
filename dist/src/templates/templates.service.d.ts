import { CreateTemplateDto } from './../requests/dto/create-template.dto';
import { UpdateTemplateDto } from './../requests/dto/update-template.dto';
import { Template } from './../requests/entities/template.entity';
import { RequestStage } from './../requests/entities/requestStage.entity';
import { Repository } from 'typeorm';
export declare class TemplatesService {
    private readonly templatesRepository;
    private readonly requestsStageRepository;
    constructor(templatesRepository: Repository<Template>, requestsStageRepository: Repository<RequestStage>);
    getAllTemplates(): Promise<{
        success: boolean;
        data: Template[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createTemplate(template: CreateTemplateDto): Promise<{
        success: boolean;
        data: {
            id: any;
            templateName: string;
            templateContent: string;
            requestStage: number | RequestStage;
            order: number;
            isVario: boolean;
            consecutive?: number;
            prefix?: string;
            documentType?: string;
            seNotificaQuejoso: boolean;
            seComunicaQuejoso: boolean;
            fechaNotificacionQuejoso: Date;
            fechaComunicacionQuejoso: Date;
            seComunicaDisciplinado: boolean;
            seNotificaDisciplinado: boolean;
            fechaNotificacionDisciplinado: Date;
            fechaComunicacionDisciplinado: Date;
            seComunicaApoderado: boolean;
            seNotificaApoderado: boolean;
            fechaNotificacionApoderado: Date;
            fechaComunicacionApoderado: Date;
        } & Template;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    updateTemplate(template: UpdateTemplateDto): Promise<{
        success: boolean;
        data: UpdateTemplateDto & Template;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
