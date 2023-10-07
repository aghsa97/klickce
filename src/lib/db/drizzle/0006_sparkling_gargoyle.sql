ALTER TABLE `customers` MODIFY COLUMN `SubPlan` enum('BASIC','PRO','ENTERPRISE');--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `publicId` varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` ADD `email` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD `ownerId` varchar(50) NOT NULL;--> statement-breakpoint
CREATE INDEX `publicId_index` ON `images` (`publicId`);--> statement-breakpoint
CREATE INDEX `ownerId_index` ON `images` (`ownerId`);--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_publicId_unique` UNIQUE(`publicId`);