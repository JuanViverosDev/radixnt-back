"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$npmConfigName1685596259369 = void 0;
class $npmConfigName1685596259369 {
    constructor() {
        this.name = '$npmConfigName1685596259369';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "request_header" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "request_header" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
exports.$npmConfigName1685596259369 = $npmConfigName1685596259369;
//# sourceMappingURL=1685596259369-$npm_config_name.js.map