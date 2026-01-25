CREATE TABLE `client_skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`skillId` int NOT NULL,
	`isEnabled` boolean NOT NULL DEFAULT true,
	`config` json DEFAULT ('{}'),
	`usageCount` int NOT NULL DEFAULT 0,
	`lastUsedAt` timestamp,
	`activatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('clawdbot','composio','n8n','custom') NOT NULL,
	`skillId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100),
	`requirements` json DEFAULT ('[]'),
	`config` json DEFAULT ('{}'),
	`metadata` json DEFAULT ('{}'),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`),
	CONSTRAINT `skills_skillId_unique` UNIQUE(`skillId`)
);
--> statement-breakpoint
ALTER TABLE `client_skills` ADD CONSTRAINT `client_skills_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_skills` ADD CONSTRAINT `client_skills_skillId_skills_id_fk` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE cascade ON UPDATE no action;