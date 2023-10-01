ALTER TABLE `customers` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `customers` MODIFY COLUMN `SubPlan` enum('BASIC','PRO','ENTERPRISE') DEFAULT 'BASIC';--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `color` varchar(7) DEFAULT '';--> statement-breakpoint
ALTER TABLE `customers` ADD `ends_at` timestamp;--> statement-breakpoint
ALTER TABLE `customers` ADD `paid_until` timestamp;--> statement-breakpoint
ALTER TABLE `customers` ADD `stripe_id` varchar(256);--> statement-breakpoint
ALTER TABLE `customers` ADD `subscription_id` text;--> statement-breakpoint
CREATE INDEX `views_index` ON `maps` (`views`);--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_stripe_id_unique` UNIQUE(`stripe_id`);