import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793654492435 implements MigrationInterface {
    name = 'Migration1793654492435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_beb60b294976289ed62840b3caf"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_3058184fb9fa12f33a65047f247"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_7b7af6fe342848348e6a7b60ce9" PRIMARY KEY ("matchId", "puuid", "id")`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "championName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "individualPosition" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "totalDamageDealtToChampions" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "totalMinionsKilled" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "neutralMinionsKilled" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "champLevel" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "summoner1Id" integer`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD "summoner2Id" integer`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "gameCreation"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "gameCreation" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "gameDuration"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "gameDuration" bigint NOT NULL`);

        await queryRunner.query(`
            CREATE TYPE "public"."matches_region_enum"
            AS ENUM ('americas', 'europe', 'asia', 'sea')
        `);

        await queryRunner.query(`
            ALTER TABLE "matches"
            ALTER COLUMN "region"
            TYPE "public"."matches_region_enum"
            USING "region"::text::"public"."matches_region_enum"
        `);


        await queryRunner.query(`
            CREATE TYPE "public"."players_region_enum"
            AS ENUM ('la2', 'br1', 'na1', 'euw1', 'kr')
        `);

        await queryRunner.query(`
            ALTER TABLE "players"
            ALTER COLUMN "region"
            TYPE "public"."players_region_enum"
            USING "region"::text::"public"."players_region_enum"
        `);

        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_35e02d041d5f10b996078208f31"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_7b7af6fe342848348e6a7b60ce9"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_c928b7bb1fabac7ee6977ea33cb" PRIMARY KEY ("puuid", "id")`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_c928b7bb1fabac7ee6977ea33cb"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_0ad61c7059cbe8a5c85c34376c1" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3058184fb9fa12f33a65047f24" ON "match_participants"  ("matchId", "puuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b27da86fa2529004b50bcd24a9" ON "match_participants"  ("championId") `);
        await queryRunner.query(`CREATE INDEX "IDX_beb60b294976289ed62840b3ca" ON "match_participants"  ("puuid") `);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_35e02d041d5f10b996078208f31" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_beb60b294976289ed62840b3caf" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_beb60b294976289ed62840b3caf"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "FK_35e02d041d5f10b996078208f31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_beb60b294976289ed62840b3ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b27da86fa2529004b50bcd24a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3058184fb9fa12f33a65047f24"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_0ad61c7059cbe8a5c85c34376c1"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_c928b7bb1fabac7ee6977ea33cb" PRIMARY KEY ("puuid", "id")`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_c928b7bb1fabac7ee6977ea33cb"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_7b7af6fe342848348e6a7b60ce9" PRIMARY KEY ("matchId", "puuid", "id")`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_35e02d041d5f10b996078208f31" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`
            ALTER TABLE "players"
            ALTER COLUMN "region"
            TYPE character varying
            USING "region"::text
        `);

        await queryRunner.query(`
            DROP TYPE "public"."players_region_enum"
        `);

        await queryRunner.query(`
            ALTER TABLE "matches"
            ALTER COLUMN "gameDuration"
            TYPE bigint
            USING "gameDuration"::bigint;`
        );
        
        await queryRunner.query(`
            ALTER TABLE "matches"
            ALTER COLUMN "gameCreation"
            TYPE bigint
            USING (EXTRACT(EPOCH FROM "gameCreation") * 1000)::bigint;
        `);
      
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "summoner2Id"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "summoner1Id"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "champLevel"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "neutralMinionsKilled"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "totalMinionsKilled"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "totalDamageDealtToChampions"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "individualPosition"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "championName"`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP CONSTRAINT "PK_7b7af6fe342848348e6a7b60ce9"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "PK_3058184fb9fa12f33a65047f247" PRIMARY KEY ("matchId", "puuid")`);
        await queryRunner.query(`ALTER TABLE "match_participants" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match_participants" ADD CONSTRAINT "FK_beb60b294976289ed62840b3caf" FOREIGN KEY ("puuid") REFERENCES "players"("puuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
