CREATE TABLE `clawdbot_instances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`instanceName` varchar(255) NOT NULL,
	`configPath` varchar(500) NOT NULL,
	`whatsappSessionPath` varchar(500),
	`processId` int,
	`status` enum('running','stopped','pairing','error') NOT NULL DEFAULT 'stopped',
	`qrCode` text,
	`qrCodeExpiry` timestamp,
	`lastHealthCheck` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clawdbot_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `clawdbot_instances_instanceName_unique` UNIQUE(`instanceName`)
);
--> statement-breakpoint
CREATE TABLE `client_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`logoUrl` varchar(500),
	`logoS3Key` varchar(500),
	`primaryColor` varchar(7),
	`secondaryColor` varchar(7),
	`accentColor` varchar(7),
	`assistantName` varchar(100),
	`assistantPersonality` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`ownerName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`whatsappNumber` varchar(20),
	`businessDescription` text,
	`status` enum('active','paused','cancelled','pending') NOT NULL DEFAULT 'pending',
	`onboardingCompleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `notification_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('signup','upgrade','payment_failed','cancellation','system') NOT NULL,
	`clientId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`sentTo` varchar(320) NOT NULL,
	`status` enum('sent','failed') NOT NULL DEFAULT 'sent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`subscriptionId` int,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'MXN',
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`externalTransactionId` varchar(255),
	`failureReason` text,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`tier` enum('basico','profesional','empresarial') NOT NULL,
	`priceMonthly` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'MXN',
	`status` enum('active','past_due','cancelled','trialing') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`externalSubscriptionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`date` timestamp NOT NULL,
	`messagesSent` int NOT NULL DEFAULT 0,
	`messagesReceived` int NOT NULL DEFAULT 0,
	`voiceMinutes` decimal(10,2) NOT NULL DEFAULT '0',
	`apiCalls` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usage_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clawdbot_instances` ADD CONSTRAINT `clawdbot_instances_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_assets` ADD CONSTRAINT `client_assets_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_log` ADD CONSTRAINT `notification_log_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_subscriptionId_subscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usage_analytics` ADD CONSTRAINT `usage_analytics_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;