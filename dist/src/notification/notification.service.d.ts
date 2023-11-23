import { HttpService } from '@nestjs/axios';
import { RecipientDto } from './dto/recipients.dto';
export declare class NotificationService {
    private readonly httpService;
    constructor(httpService: HttpService);
    sendSendGrid(recipients: RecipientDto[], template_id_text: string, dynamic_template_data: object): Promise<any>;
}
