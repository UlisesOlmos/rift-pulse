import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793647494987 implements MigrationInterface {
    name = 'Migration1793647494987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matches" ("matchId" character varying NOT NULL, "region" character varying NOT NULL, "gameCreation" TIMESTAMP NOT NULL, "gameDuration" integer NOT NULL, "gameVersion" character varying NOT NULL, "queueId" integer NOT NULL, "gameMode" character varying, CONSTRAINT "PK_00f0b0a807779364b0671ff5a35" PRIMARY KEY ("matchId"))`);
        await queryRunner.query(`CREATE TABLE "player_rank_snapshots" ("id" BIGSERIAL NOT NULL, "puuid" character varying NOT NULL, "queueType" character varying NOT NULL, "tier" character varying NOT NULL, "division" character varying, "leaguePoints" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "capturedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_badd6931c8e0f29bd658ad42a1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "players" ("puuid" character varying NOT NULL, "region" character varying NOT NULL, "gameName" character varying, "tagLine" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastCheckedAt" TIMESTAMP, CONSTRAINT "PK_90d912b967c8fb37ea3775b9205" PRIMARY KEY ("puuid"))`);
        await queryRunner.query(`CREATE TABLE "match_participants" ("matchId" character varying NOT NULL, "puuid" character varying NOT NULL, "championId" integer NOT NULL, "teamId" integer NOT NULL, "teamPosition" character varying, "win" boolean NOT NULL, "kills" integer NOT NULL, "deaths" integer NOT NULL, "assists" integer NOT NULL, "goldEarned" integer NOT NULL, CONSTRAINT "PK_3058184fb9fa12f33a65047f247" PRIMARY KEY ("matchId", "puuid"))`);
        await queryRunner.query(`ALTER TABLE "player_rank_snapshots" ADD CONSTRAINT "FK_6a8b18115faff5601ae0ee9354c" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_35e02d041d5f10b996078208f31" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_beb60b294976289ed62840b3caf" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_beb60b294976289ed62840b3caf"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_35e02d041d5f10b996078208f31"`);
        await queryRunner.query(`ALTER TABLE "player_rank_snapshots" DROP CONSTRAINT "FK_6a8b18115faff5601ae0ee9354c"`);
        await queryRunner.query(`DROP TABLE "match_participants"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "player_rank_snapshots"`);
        await queryRunner.query(`DROP TABLE "matches"`);
    }

}
