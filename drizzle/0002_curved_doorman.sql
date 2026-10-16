CREATE TABLE IF NOT EXISTS `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`service` text NOT NULL,
	`rating` integer NOT NULL,
	`message` text NOT NULL,
	`allow_quote` integer NOT NULL,
	`created_at` text NOT NULL
);
