ALTER TABLE `maps` MODIFY COLUMN `style` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `maps` MODIFY COLUMN `description` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `color` varchar(7) NOT NULL DEFAULT '#eab308';--> statement-breakpoint
ALTER TABLE `spots` MODIFY COLUMN `description` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `spots` MODIFY COLUMN `projectId` varchar(30) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `maps` ADD `isUserCurrentLocationVisible` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `maps` ADD `hasLandingPage` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `maps` ADD `isAccessible` boolean DEFAULT true NOT NULL;