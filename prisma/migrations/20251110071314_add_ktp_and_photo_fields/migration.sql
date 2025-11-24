-- AlterTable
ALTER TABLE `application` ADD COLUMN `ktpUrl` VARCHAR(191) NULL,
    ADD COLUMN `ktpVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `photo3x4Url` VARCHAR(191) NULL;
