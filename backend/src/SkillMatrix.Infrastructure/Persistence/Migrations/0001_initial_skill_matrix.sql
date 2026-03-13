-- Skill Matrix initial schema (MySQL)

CREATE TABLE IF NOT EXISTS `__skillmatrix_migrations` (
  `id` VARCHAR(128) NOT NULL,
  `applied_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `skill_categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `updated_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_skill_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `skill_subcategories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `updated_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_skill_subcategories_category_name` (`category_id`, `name`),
  KEY `ix_skill_subcategories_category_id` (`category_id`),
  CONSTRAINT `fk_skill_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `skill_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `skills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `subcategory_id` BIGINT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `definition` LONGTEXT NOT NULL,
  `version` INT NOT NULL,
  `status` VARCHAR(32) NOT NULL,
  `replaced_by_skill_id` BIGINT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `updated_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_skills_subcategory_name` (`subcategory_id`, `name`),
  KEY `ix_skills_subcategory_status` (`subcategory_id`, `status`),
  CONSTRAINT `fk_skills_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `skill_subcategories` (`id`),
  CONSTRAINT `fk_skills_replaced_by` FOREIGN KEY (`replaced_by_skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `proficiency_levels` (
  `code` VARCHAR(32) NOT NULL,
  `display_name` VARCHAR(64) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `sort_order` INT NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `proficiency_levels` (`code`, `display_name`, `description`, `sort_order`) VALUES
  ('Beginner', 'Beginner', 'Understands basic concepts and can perform simple tasks with guidance.', 1),
  ('Intermediate', 'Intermediate', 'Can work independently on common tasks and explain concepts to others.', 2),
  ('Advanced', 'Advanced', 'Can solve complex problems and mentor others; deep practical experience.', 3),
  ('Expert', 'Expert', 'Recognized authority; drives standards and solves novel/high-impact problems.', 4);

CREATE TABLE IF NOT EXISTS `employee_skills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `employee_id` VARCHAR(128) NOT NULL,
  `skill_id` BIGINT NOT NULL,
  `active_proficiency_code` VARCHAR(32) NOT NULL,
  `validation_status` VARCHAR(32) NOT NULL,
  `last_validated_at_utc` DATETIME(6) NULL,
  `validation_expires_at_utc` DATETIME(6) NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `updated_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_skills_employee_skill` (`employee_id`, `skill_id`),
  KEY `ix_employee_skills_employee_id` (`employee_id`),
  KEY `ix_employee_skills_skill_id` (`skill_id`),
  CONSTRAINT `fk_employee_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `evidence_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `employee_skill_id` BIGINT NOT NULL,
  `type` VARCHAR(64) NOT NULL,
  `external_ref` VARCHAR(256) NULL,
  `file_ref` VARCHAR(512) NULL,
  `metadata_json` LONGTEXT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_evidence_items_employee_skill_id` (`employee_skill_id`),
  CONSTRAINT `fk_evidence_items_employee_skill` FOREIGN KEY (`employee_skill_id`) REFERENCES `employee_skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `skill_ratings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `employee_skill_id` BIGINT NOT NULL,
  `source` VARCHAR(32) NOT NULL,
  `proficiency_code` VARCHAR(32) NOT NULL,
  `rater_employee_id` VARCHAR(128) NULL,
  `notes` VARCHAR(1000) NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_skill_ratings_employee_skill_id` (`employee_skill_id`),
  KEY `ix_skill_ratings_employee_skill_source` (`employee_skill_id`, `source`),
  CONSTRAINT `fk_skill_ratings_employee_skill` FOREIGN KEY (`employee_skill_id`) REFERENCES `employee_skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `validation_requests` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `employee_skill_id` BIGINT NOT NULL,
  `requested_by_employee_id` VARCHAR(128) NOT NULL,
  `requested_proficiency_code` VARCHAR(32) NOT NULL,
  `status` VARCHAR(32) NOT NULL,
  `submitted_at_utc` DATETIME(6) NOT NULL,
  `decided_at_utc` DATETIME(6) NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `updated_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_validation_requests_employee_skill_id` (`employee_skill_id`),
  KEY `ix_validation_requests_status_submitted_at` (`status`, `submitted_at_utc`),
  CONSTRAINT `fk_validation_requests_employee_skill` FOREIGN KEY (`employee_skill_id`) REFERENCES `employee_skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `validation_decisions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `validation_request_id` BIGINT NOT NULL,
  `decider_employee_id` VARCHAR(128) NOT NULL,
  `decision` VARCHAR(32) NOT NULL,
  `final_proficiency_code` VARCHAR(32) NULL,
  `feedback` VARCHAR(2000) NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_validation_decisions_request_id` (`validation_request_id`),
  CONSTRAINT `fk_validation_decisions_request` FOREIGN KEY (`validation_request_id`) REFERENCES `validation_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `audit_log_entries` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `actor_employee_id` VARCHAR(128) NOT NULL,
  `action` VARCHAR(200) NOT NULL,
  `scope_type` VARCHAR(64) NULL,
  `scope_id` VARCHAR(128) NULL,
  `details_json` LONGTEXT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_audit_log_entries_created_at` (`created_at_utc`),
  KEY `ix_audit_log_entries_actor_employee_id` (`actor_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `outbox_messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(200) NOT NULL,
  `payload_json` LONGTEXT NOT NULL,
  `occurred_at_utc` DATETIME(6) NOT NULL,
  `created_at_utc` DATETIME(6) NOT NULL,
  `processed_at_utc` DATETIME(6) NULL,
  `processing_error` LONGTEXT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_outbox_messages_processed_at` (`processed_at_utc`),
  KEY `ix_outbox_messages_occurred_at` (`occurred_at_utc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

