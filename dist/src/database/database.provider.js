"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
exports.DatabaseProvider = typeorm_1.TypeOrmModule.forRootAsync({
    inject: [config_1.ConfigService],
    async useFactory(config) {
        const dbConfig = {
            type: 'postgres',
            host: config.get('POSTGRES_HOST'),
            username: config.get('POSTGRES_USER'),
            password: config.get('POSTGRES_PASSWORD'),
            port: config.get('POSTGRES_PORT'),
            database: config.get('POSTGRES_DATABASE'),
            autoLoadEntities: true,
            ssl: false,
        };
        return dbConfig;
    },
});
//# sourceMappingURL=database.provider.js.map