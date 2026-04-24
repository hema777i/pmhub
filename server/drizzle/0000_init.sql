CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`sources` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text,
	`model` text DEFAULT 'gpt-4o-mini' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `knowledge_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`short_title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`process_groups` text NOT NULL,
	`key_concepts` text NOT NULL,
	`inputs` text NOT NULL,
	`outputs` text NOT NULL,
	`tools_techniques` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `knowledge_chunks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`chunk_type` text DEFAULT 'overview' NOT NULL,
	`metadata` text,
	`embedding` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `knowledge_subtasks` (
	`id` text PRIMARY KEY NOT NULL,
	`area_id` text NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `process_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`key_activities` text NOT NULL,
	`deliverables` text NOT NULL,
	`knowledge_areas` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`user_id` integer NOT NULL,
	`area_id` text NOT NULL,
	`status` text DEFAULT 'locked' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_tool_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`tool_type` text NOT NULL,
	`title` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`github_id` text NOT NULL,
	`username` text NOT NULL,
	`avatar` text,
	`email` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);