CREATE TABLE `catalog_products` (
	`id` varchar(64) NOT NULL,
	`handle` varchar(160) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` text NOT NULL,
	`imageAltText` varchar(255),
	`tagsJson` text NOT NULL,
	`available` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalog_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_products_handle_unique` UNIQUE(`handle`)
);
