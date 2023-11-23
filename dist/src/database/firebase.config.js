"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = void 0;
const config_1 = require("@nestjs/config");
const configService = new config_1.ConfigService();
exports.firebaseConfig = {
    apiKey: configService.get('APIKEY'),
    authDomain: configService.get('AUTHDOMAIN'),
    projectId: configService.get('PROJECTID'),
    storageBucket: configService.get('STORAGEBUCKET'),
    messagingSenderId: configService.get('MESSAGINGSENDERID'),
    appId: configService.get('APPID'),
};
//# sourceMappingURL=firebase.config.js.map