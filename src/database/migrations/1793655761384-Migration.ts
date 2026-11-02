import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793655761384 implements MigrationInterface {
    name = 'Migration1793655761384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_35e02d041d5f10b996078208f31"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_beb60b294976289ed62840b3caf"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "playerPuuid" character varying`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "region"`);
        await queryRunner.query(`CREATE TYPE "public"."matches_region_enum" AS ENUM('americas', 'europe', 'asia', 'sea')`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "region" "public"."matches_region_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_35e02d041d5f10b996078208f31" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_22b6b4a1e7f05fed7011b9d4359" FOREIGN KEY ("playerPuuid") REFERENCES "players"("puuid") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_22b6b4a1e7f05fed7011b9d4359"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_35e02d041d5f10b996078208f31"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "region"`);
        await queryRunner.query(`DROP TYPE "public"."matches_region_enum"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "region" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "playerPuuid"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_beb60b294976289ed62840b3caf" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_35e02d041d5f10b996078208f31" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
