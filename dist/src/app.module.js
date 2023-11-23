"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const utils_module_1 = require("./utils/utils.module");
const users_module_1 = require("./users/users.module");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const requests_module_1 = require("./requests/requests.module");
const config_request_module_1 = require("./config-request/config-request.module");
const attachments_module_1 = require("./attachments/attachments.module");
const templates_module_1 = require("./templates/templates.module");
const auth_strategy_1 = require("./auth/auth.strategy");
const attachments_v2_module_1 = require("./attachments-v2/attachments-v2.module");
const schedule_1 = require("@nestjs/schedule");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            utils_module_1.UtilsModule,
            users_module_1.UsersModule,
            database_module_1.DatabaseModule,
            requests_module_1.RequestsModule,
            config_request_module_1.ConfigRequestModule,
            attachments_module_1.AttachmentsModule,
            templates_module_1.TemplatesModule,
            attachments_v2_module_1.AttachmentsV2Module,
            notifications_module_1.NotificationsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, auth_strategy_1.FirebaseAuthStrategy],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map