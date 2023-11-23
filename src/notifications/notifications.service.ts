import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import * as twilio from 'twilio';
import { SnsService } from '@vetsmm/nestjs-sns';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private whatsappClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly _snsService: SnsService,
    @InjectRepository(EmailTemplate)
    private readonly _emailTemplateRepository: Repository<EmailTemplate>,
  ) {
    this.emailTransporter = nodemailer.createTransport({
      pool: true,
      service: 'gmail',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      from: this.configService.get('EMAIL_DEFAULT_FROM'),
    });

    this.whatsappClient = twilio(
      this.configService.get('ACCOUNT_SID'),
      this.configService.get('AUTH_TOKEN'),
    );
  }

  async sendEmail(options: {
    recipient: string | string[];
    templateName?: string;
    content?: string;
    data: any;
    attachments?: any[];
  }) {
    /* *
    * @description envia templates html desde una dirección de correo especificada en el .env (en caso de gmail, debe agregarse una clave de aplicacion)

    * @param recipient "user@gmail.com"

    * @param templateName nombre del archivo html (sin la extension) que se
    * encuentre en la carpeta email-templates

    * @param data objeto con las variables usadas en la template, en la plantilla se deben escribir las variables de la forma {{var_name}}
    * */
    try {
      const { recipient, templateName, data, attachments, content } = options;

      let source: string;

      if (templateName) {
        const pathToTemplate = join(
          __dirname, // cid_backend/dist/src/requests/thisFile
          '..',
          '..',
          '..', // cid_backend
          'email-templates',
          `${templateName}.html`,
        );
        source = await fs.readFile(pathToTemplate, 'utf-8');
      } else source = content;
      
      const template = handlebars.compile(source);
      const html = template(data);
    

      await this.emailTransporter.sendMail({
        to: recipient,
        subject: 'CID Emcali',
        html: html,
        attachments: attachments ?? [],
      });

      return {
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async sendWhatsapp(phoneNumber: string, body: string) {
    try {
      await this.whatsappClient.messages.create({
        body: body,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+57${phoneNumber}`,
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async sendSms(phoneNumber: string, body: string) {
    /*
     * @description envia un mensaje de texto a un numero de telefono, debe estar verificado en sns de aws
     *
     * @param phoneNumber numero de telefono al que se le va a enviar el mensaje (sin el +57)
     * @param body cuerpo del mensaje
     */
    try {
      await this._snsService.publish({
        Message: body,
        PhoneNumber: `+57${phoneNumber}`,
      });
    } catch (err) {
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
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async findEmailTemplateById(id: string) {
    try {
      const template = await this._emailTemplateRepository.findOne({
        where: { id },
      });
      return {
        success: true,
        data: template,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async createEmailTemplate(options: {
    name: string;
    subject: string;
    body: string;
  }) {
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
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async updateEmailTemplate(options: {
    id: string;
    name?: string;
    subject?: string;
    body?: string;
  }) {
    try {
      const template = await this._emailTemplateRepository.save(options);
      return {
        success: true,
        data: template,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
