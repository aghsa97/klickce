CREATE TABLE `customers` (
	`id` varchar(30) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`clerkUesrId` varchar(50) NOT NULL,
	`SubPlan` enum('FREE','PAID') DEFAULT 'FREE',
	`name` text DEFAULT (''),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_clerkUesrId_unique` UNIQUE(`clerkUesrId`)
);
--> statement-breakpoint
CREATE TABLE `maps` (
	`id` varchar(30) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`isPublic` boolean NOT NULL DEFAULT true,
	`style` json DEFAULT ('{}'),
	`description` text DEFAULT (''),
	`ownerId` varchar(50) NOT NULL,
	CONSTRAINT `maps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(30) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`mapId` varchar(30) NOT NULL,
	`isVisible` boolean NOT NULL DEFAULT true,
	`color` varchar(7),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spots` (
	`id` varchar(30) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`lat` text NOT NULL,
	`lng` text NOT NULL,
	`color` varchar(7) NOT NULL DEFAULT '#3b82f6',
	`description` text DEFAULT (''),
	`mapId` varchar(30) NOT NULL,
	`projectId` varchar(30),
	CONSTRAINT `spots_id` PRIMARY KEY(`id`)
);
