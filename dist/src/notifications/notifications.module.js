"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
const nestjs_sns_1 = require("@vetsmm/nestjs-sns");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const email_template_entity_1 = require("./entities/email-template.entity");
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [notifications_controller_1.NotificationsController],
        exports: [notifications_service_1.NotificationsService],
        imports: [
            nestjs_sns_1.SnsModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    region: configService.get('AWS_REGION'),
                    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([email_template_entity_1.EmailTemplate]),
        ],
        providers: [notifications_service_1.NotificationsService]
    })
], NotificationsModule);
exports.NotificationsModule = NotificationsModule;
//# sourceMappingURL=notifications.module.js.map