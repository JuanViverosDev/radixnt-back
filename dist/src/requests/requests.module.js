"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsModule = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const requests_controller_1 = require("./requests.controller");
const typeRequest_entity_1 = require("./entities/typeRequest.entity");
const typeorm_1 = require("@nestjs/typeorm");
const processState_entity_1 = require("./entities/processState.entity");
const typeCommunication_entity_1 = require("./entities/typeCommunication.entity");
const request_entity_1 = require("./entities/request.entity");
const users_module_1 = require("../users/users.module");
const requestDisciplined_entity_1 = require("./entities/requestDisciplined.entity");
const document_entity_1 = require("./entities/document.entity");
const requestState_entity_1 = require("./entities/requestState.entity");
const requestObservations_entity_1 = require("./entities/requestObservations.entity");
const requestStage_entity_1 = require("./entities/requestStage.entity");
const template_entity_1 = require("./entities/template.entity");
const attachment_entity_1 = require("./../attachments/entities/attachment.entity");
const observations_service_1 = require("./observations.service");
const config_entity_1 = require("./entities/config.entity");
const folio_entity_1 = require("./entities/folio.entity");
const axios_1 = require("@nestjs/axios");
const notifications_module_1 = require("../notifications/notifications.module");
let RequestsModule = class RequestsModule {
};
RequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            typeorm_1.TypeOrmModule.forFeature([
                typeRequest_entity_1.TypeRequest,
                processState_entity_1.ProcessState,
                typeCommunication_entity_1.TypeCommunication,
                request_entity_1.RequestHeader,
                requestDisciplined_entity_1.RequestDisciplined,
                document_entity_1.Documents,
                requestState_entity_1.RequestState,
                requestObservations_entity_1.RequestObservations,
                requestStage_entity_1.RequestStage,
                template_entity_1.Template,
                attachment_entity_1.Attachment,
                config_entity_1.Config,
                folio_entity_1.Folio,
            ]),
        ],
        controllers: [requests_controller_1.RequestsController],
        providers: [requests_service_1.RequestsService, observations_service_1.ObservationsService],
    })
], RequestsModule);
exports.RequestsModule = RequestsModule;
//# sourceMappingURL=requests.module.js.map