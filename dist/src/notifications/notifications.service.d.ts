import { ConfigService } from '@nestjs/config';
import { SnsService } from '@vetsmm/nestjs-sns';
import { EmailTemplate } from './entities/email-template.entity';
import { Repository } from 'typeorm';
export declare class NotificationsService {
    private readonly configService;
    private readonly _snsService;
    private readonly _emailTemplateRepository;
    private emailTransporter;
    private whatsappClient;
    constructor(configService: ConfigService, _snsService: SnsService, _emailTemplateRepository: Repository<EmailTemplate>);
    sendEmail(options: {
        recipient: string | string[];
        templateName?: string;
        content?: string;
        data: any;
        attachments?: any[];
    }): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    sendWhatsapp(phoneNumber: string, body: string): Promise<{
        success: boolean;
        message: any;
    }>;
    sendSms(phoneNumber: string, body: string): Promise<{
        success: boolean;
        message: any;
    }>;
    findAllEmailTemplates(): Promise<{
        success: boolean;
        data: Promise<EmailTemplate[]>;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findEmailTemplateById(id: string): Promise<{
        success: boolean;
        data: EmailTemplate;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    createEmailTemplate(options: {
        name: string;
        subject: string;
        body: string;
    }): Promise<{
        success: boolean;
        data: EmailTemplate;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    updateEmailTemplate(options: {
        id: string;
        name?: string;
        subject?: string;
        body?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            name?: string;
            subject?: string;
            body?: string;
        } & EmailTemplate;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
