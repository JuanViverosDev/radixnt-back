"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$npmConfigName1685390574032 = void 0;
class $npmConfigName1685390574032 {
    constructor() {
        this.name = '$npmConfigName1685390574032';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "request_disciplined" ADD "lawyerId" uuid`);
        await queryRunner.query(`ALTER TABLE "request_disciplined" ADD CONSTRAINT "FK_19e24bba27eb04add12cbc77f20" FOREIGN KEY ("lawyerId") REFERENCES "lawyers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "request_disciplined" DROP CONSTRAINT "FK_19e24bba27eb04add12cbc77f20"`);
        await queryRunner.query(`ALTER TABLE "request_disciplined" DROP COLUMN "lawyerId"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
exports.$npmConfigName1685390574032 = $npmConfigName1685390574032;
//# sourceMappingURL=1685390574032-$npm_config_name.js.map