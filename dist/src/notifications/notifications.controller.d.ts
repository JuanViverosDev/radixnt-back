import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly _notificationsService;
    constructor(_notificationsService: NotificationsService);
    getEmailTemplates(): Promise<{
        success: boolean;
        data: Promise<import("./entities/email-template.entity").EmailTemplate[]>;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
