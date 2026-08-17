CREATE TABLE `membershipApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`status` enum('pending','approved','active') NOT NULL DEFAULT 'pending',
	`activationCodeHash` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`activatedAt` timestamp,
	CONSTRAINT `membershipApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `membership_applications_email_idx` ON `membershipApplications` (`email`);--> statement-breakpoint
CREATE INDEX `membership_applications_status_idx` ON `membershipApplications` (`status`);