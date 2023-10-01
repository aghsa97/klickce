ALTER TABLE `spots` MODIFY COLUMN `lat` double NOT NULL;--> statement-breakpoint
ALTER TABLE `spots` MODIFY COLUMN `lng` double NOT NULL;--> statement-breakpoint
ALTER TABLE `spots` MODIFY COLUMN `projectId` varchar(30) DEFAULT '';--> statement-breakpoint
CREATE INDEX `ownerId_index` ON `maps` (`ownerId`);--> statement-breakpoint
CREATE INDEX `project_mapId_index` ON `projects` (`mapId`);--> statement-breakpoint
CREATE INDEX `spot_mapId_index` ON `spots` (`mapId`);--> statement-breakpoint
CREATE INDEX `spot_projectId_index` ON `spots` (`projectId`);