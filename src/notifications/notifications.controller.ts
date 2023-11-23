import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly _notificationsService: NotificationsService) {}

  @Get('email-templates')
  async getEmailTemplates() {
    return await this._notificationsService.findAllEmailTemplates();
  }
}
