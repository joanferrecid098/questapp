-- @block database creation
-- CREATE DATABASE questapp;
USE questapp;

-- @block users
CREATE TABLE `users`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `streak` INT(16) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

-- @block groups
CREATE TABLE `groupss`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `owner_id` BIGINT NOT NULL,
    `last_updated` DATETIME NOT NULL,
    FOREIGN KEY (`owner_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

-- @block questions
CREATE TABLE `questions`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(255) NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `group_id` BIGINT NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

-- @block memberships
CREATE TABLE `memberships`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

-- @block votes
CREATE TABLE `votes`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `from_id` BIGINT NOT NULL,
    `to_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    FOREIGN KEY (`from_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`to_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES questions(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

-- @block invites
CREATE TABLE `invites`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `from_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    `uuid` VARCHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (`from_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

-- @block notifications
CREATE TABLE `notifications`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    `notifications` INT(8) NOT NULL,
    `last_update` DATE NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES users(`id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);