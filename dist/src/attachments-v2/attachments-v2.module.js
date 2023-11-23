"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsV2Module = void 0;
const common_1 = require("@nestjs/common");
const attachments_v2_service_1 = require("./attachments-v2.service");
const nestjs_s3_1 = require("nestjs-s3");
const config_1 = require("@nestjs/config");
const attachments_v2_controller_1 = require("./attachments-v2.controller");
const typeorm_1 = require("@nestjs/typeorm");
const attachment_v2_entity_1 = require("./entities/attachment-v2.entity");
let AttachmentsV2Module = class AttachmentsV2Module {
};
AttachmentsV2Module = __decorate([
    (0, common_1.Module)({
        providers: [attachments_v2_service_1.AttachmentsV2Service, config_1.ConfigService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([attachment_v2_entity_1.AttachmentV2]),
            nestjs_s3_1.S3Module.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        config: {
                            credentials: {
                                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
                            },
                            region: configService.get('AWS_REGION')
                        }
                    };
                }
            })
        ],
        controllers: [attachments_v2_controller_1.AttachmentsV2Controller]
    })
], AttachmentsV2Module);
exports.AttachmentsV2Module = AttachmentsV2Module;
//# sourceMappingURL=attachments-v2.module.js.map