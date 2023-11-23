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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const handlebars = require("handlebars");
const twilio = require("twilio");
const nestjs_sns_1 = require("@vetsmm/nestjs-sns");
const typeorm_1 = require("@nestjs/typeorm");
const email_template_entity_1 = require("./entities/email-template.entity");
const typeorm_2 = require("typeorm");
let NotificationsService = class NotificationsService {
    constructor(configService, _snsService, _emailTemplateRepository) {
        this.configService = configService;
        this._snsService = _snsService;
        this._emailTemplateRepository = _emailTemplateRepository;
        this.emailTransporter = nodemailer.createTransport({
            pool: true,
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
            from: this.configService.get('EMAIL_DEFAULT_FROM'),
        });
        this.whatsappClient = twilio(this.configService.get('ACCOUNT_SID'), this.configService.get('AUTH_TOKEN'));
    }
    async sendEmail(options) {
        try {
            const { recipient, templateName, data, attachments, content } = options;
            let source;
            if (templateName) {
                const pathToTemplate = (0, path_1.join)(__dirname, '..', '..', '..', 'email-templates', `${templateName}.html`);
                source = await fs.readFile(pathToTemplate, 'utf-8');
            }
            else
                source = content;
            const template = handlebars.compile(source);
            const html = template(data);
            await this.emailTransporter.sendMail({
                to: recipient,
                subject: 'CID Emcali',
                html: html,
                attachments: attachments !== null && attachments !== void 0 ? attachments : [],
            });
            return {
                success: true,
            };
        }
        catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async sendWhatsapp(phoneNumber, body) {
        try {
            await this.whatsappClient.messages.create({
                body: body,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+57${phoneNumber}`,
            });
        }
        catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async sendSms(phoneNumber, body) {
        try {
            await this._snsService.publish({
                Message: body,
                PhoneNumber: `+57${phoneNumber}`,
            });
        }
        catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async findAllEmailTemplates() {
        try {
            const templates = this._emailTemplateRepository.find();
            return {
                success: true,
                data: templates,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async findEmailTemplateById(id) {
        try {
            const template = await this._emailTemplateRepository.findOne({
                where: { id },
            });
            return {
                success: true,
                data: template,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async createEmailTemplate(options) {
        try {
            const { name, subject, body } = options;
            const template = this._emailTemplateRepository.create({
                name,
                subject,
                body,
            });
            await this._emailTemplateRepository.save(template);
            return {
                success: true,
                data: template,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
    async updateEmailTemplate(options) {
        try {
            const template = await this._emailTemplateRepository.save(options);
            return {
                success: true,
                data: template,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(email_template_entity_1.EmailTemplate)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        nestjs_sns_1.SnsService,
        typeorm_2.Repository])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map