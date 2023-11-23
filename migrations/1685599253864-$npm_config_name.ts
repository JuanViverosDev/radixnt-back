import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1685599253864 implements MigrationInterface {
    name = '$npmConfigName1685599253864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "se_notifica_apoderado" boolean`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "se_comunica_apoderado" boolean`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fecha_notificacion_apoderado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fecha_comunicacion_apoderado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "template" ADD "se_notifica_apoderado" boolean`);
        await queryRunner.query(`ALTER TABLE "template" ADD "se_comunica_apoderado" boolean`);
        await queryRunner.query(`ALTER TABLE "template" ADD "fecha_notificacion_apoderado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "template" ADD "fecha_comunicacion_apoderado" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" DROP CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "fecha_comunicacion_apoderado"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "fecha_notificacion_apoderado"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "se_comunica_apoderado"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "se_notifica_apoderado"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fecha_comunicacion_apoderado"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fecha_notificacion_apoderado"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "se_comunica_apoderado"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "se_notifica_apoderado"`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_a1390ec58c0a6ac3f3d604d4b2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules_roles" ADD CONSTRAINT "FK_d3317370f8e59bb58fc5f00346e" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
