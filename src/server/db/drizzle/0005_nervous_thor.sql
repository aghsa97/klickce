CREATE TABLE `images` (
	`id` varchar(30) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publicId` text NOT NULL,
	`spotId` varchar(30) NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `spotId_index` ON `images` (`spotId`);