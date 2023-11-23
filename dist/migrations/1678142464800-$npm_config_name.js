"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$npmConfigName1678142464800 = void 0;
class $npmConfigName1678142464800 {
    constructor() {
        this.name = '$npmConfigName1678142464800';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fecha_comunicacion_fisica_disciplinado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fecha_notificacion_fisica_disciplinado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fecha_notificacion_fisica_disciplinado"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fecha_comunicacion_fisica_disciplinado"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.$npmConfigName1678142464800 = $npmConfigName1678142464800;
//# sourceMappingURL=1678142464800-$npm_config_name.js.map