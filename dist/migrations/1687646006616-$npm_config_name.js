"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$npmConfigName1687646006616 = void 0;
class $npmConfigName1687646006616 {
    constructor() {
        this.name = '$npmConfigName1687646006616';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "lawyers" ADD "publicDefenderId" character varying`);
        await queryRunner.query(`ALTER TABLE "request_header" ADD "cedulaSolicitante" character varying`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "request_header" DROP COLUMN "cedulaSolicitante"`);
        await queryRunner.query(`ALTER TABLE "lawyers" DROP COLUMN "publicDefenderId"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
exports.$npmConfigName1687646006616 = $npmConfigName1687646006616;
//# sourceMappingURL=1687646006616-$npm_config_name.js.map