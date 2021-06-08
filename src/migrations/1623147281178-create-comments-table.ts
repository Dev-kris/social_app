import {MigrationInterface, QueryRunner} from "typeorm";

export class createCommentsTable1623147281178 implements MigrationInterface {
    name = 'createCommentsTable1623147281178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `comments` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `identifier` varchar(255) NOT NULL, `body` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `postId` int NULL, INDEX `IDX_8e7297165a3d53fa13b720bb11` (`identifier`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_5d9144e84650ce78f40737e284e` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_e44ddaaa6d058cb4092f83ad61f` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_e44ddaaa6d058cb4092f83ad61f`");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_5d9144e84650ce78f40737e284e`");
        await queryRunner.query("DROP INDEX `IDX_8e7297165a3d53fa13b720bb11` ON `comments`");
        await queryRunner.query("DROP TABLE `comments`");
    }

}
