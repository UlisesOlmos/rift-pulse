import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793653150615 implements MigrationInterface {
    name = 'Migration1793653150615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."collection_cursors_region_enum" AS ENUM('la2', 'br1', 'na1', 'euw1', 'kr')`);
        await queryRunner.query(`CREATE TYPE "public"."collection_cursors_tier_enum" AS ENUM('IRON', 'BRONCE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND')`);
        await queryRunner.query(`CREATE TYPE "public"."collection_cursors_division_enum" AS ENUM('I', 'II', 'III', 'IV')`);
        await queryRunner.query(`CREATE TABLE "collection_cursors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "region" "public"."collection_cursors_region_enum" NOT NULL, "tier" "public"."collection_cursors_tier_enum" NOT NULL, "division" "public"."collection_cursors_division_enum" NOT NULL, "lastPage" integer NOT NULL DEFAULT '1', "totalPlayers" integer NOT NULL DEFAULT '0', "completed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d5725fd073e51de642c78d85c10" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collection_cursors"`);
        await queryRunner.query(`DROP TYPE "public"."collection_cursors_division_enum"`);
        await queryRunner.query(`DROP TYPE "public"."collection_cursors_tier_enum"`);
        await queryRunner.query(`DROP TYPE "public"."collection_cursors_region_enum"`);
    }

}
