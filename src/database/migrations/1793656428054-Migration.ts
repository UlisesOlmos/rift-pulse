import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793656428054 implements MigrationInterface {
    name = 'Migration1793656428054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player_match_cursors" ("puuid" character varying NOT NULL, "lastMatchId" character varying, "lastCollectedAt" TIMESTAMP, "initialBackfillCompleted" boolean NOT NULL DEFAULT false, "totalMatchesCollected" integer NOT NULL DEFAULT '0', "lastError" text, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_adfa8054d253f87b57caffc60fa" PRIMARY KEY ("puuid"))`);
        await queryRunner.query(`ALTER TABLE "player_match_cursors" ADD CONSTRAINT "FK_adfa8054d253f87b57caffc60fa" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_match_cursors" DROP CONSTRAINT "FK_adfa8054d253f87b57caffc60fa"`);
        await queryRunner.query(`DROP TABLE "player_match_cursors"`);
    }

}
