import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793657952790 implements MigrationInterface {
    name = 'Migration1793657952790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_match_cursors" ADD "lastMatchStart" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_match_cursors" DROP COLUMN "lastMatchStart"`);
    }

}
