ALTER TABLE `customers` MODIFY COLUMN `SubPlan` enum('BASIC','PRO');--> statement-breakpoint
ALTER TABLE `customers` ADD `on_trial` boolean DEFAULT false;