"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const sgMail = require('@sendgrid/mail');
let NotificationService = class NotificationService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async sendSendGrid(recipients, template_id_text, dynamic_template_data) {
        sgMail.setApiKey(process.env.EMAIL_PASSWORD);
        try {
            const message = {
                personalizations: [
                    {
                        to: recipients,
                        dynamic_template_data: dynamic_template_data
                    }
                ],
                template_id: template_id_text,
                from: {
                    email: process.env.EMAIL_DEFAULT_FROM,
                    name: 'CID Web'
                },
                attachments: [],
            };
            return sgMail.send(message)
                .then(() => console.log('Mail sent successfully'))
                .catch(error => {
                console.error(error);
            });
        }
        catch (error) {
            return error.response.data;
        }
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map