ALTER TABLE `customers` MODIFY COLUMN `SubPlan` enum('BASIC','PRO','ENTERPRISE') NOT NULL DEFAULT 'BASIC';--> statement-breakpoint
ALTER TABLE `projects` ADD `ownerId` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `spots` ADD `ownerId` varchar(50) NOT NULL;--> statement-breakpoint
CREATE INDEX `customer_clerkUesrId_index` ON `customers` (`clerkUesrId`);--> statement-breakpoint
CREATE INDEX `map_id_index` ON `maps` (`id`);--> statement-breakpoint
CREATE INDEX `project_id_index` ON `projects` (`id`);--> statement-breakpoint
CREATE INDEX `project_ownerId_index` ON `projects` (`ownerId`);--> statement-breakpoint
CREATE INDEX `spot_id_index` ON `spots` (`id`);--> statement-breakpoint
CREATE INDEX `spot_ownerId_index` ON `spots` (`ownerId`);