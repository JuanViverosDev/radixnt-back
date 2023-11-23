"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigRequestModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_request_controller_1 = require("./config-request.controller");
const config_request_service_1 = require("./config-request.service");
const lawyers_entity_1 = require("./entities/lawyers.entity");
const typeFile_entity_1 = require("./entities/typeFile.entity");
let ConfigRequestModule = class ConfigRequestModule {
};
ConfigRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([typeFile_entity_1.TypeFile, lawyers_entity_1.Lawyers]),
        ],
        controllers: [config_request_controller_1.ConfigRequestController],
        providers: [config_request_service_1.ConfigRequestService]
    })
], ConfigRequestModule);
exports.ConfigRequestModule = ConfigRequestModule;
//# sourceMappingURL=config-request.module.js.map