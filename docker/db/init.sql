-- @block database creation
-- CREATE DATABASE questapp;
USE questapp;

-- @block groups
CREATE TAB LE `groups`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
)

-- @block questions
CREATE TABLE `questions`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(255) NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `group_id` BIGINT NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`),
    PRIMARY KEY (`id`)
)

-- @block users
CREATE TABLE `users`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
)

-- @block memberships
CREATE TABLE `memberships`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES users(`id`),
    FOREIGN KEY (`group_id`) REFERENCES groups(`id`),
    PRIMARY KEY (`id`)
)

-- @block votes
CREATE TABLE `votes`
(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `from_id` BIGINT NOT NULL,
    `to_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    FOREIGN KEY (`from_id`) REFERENCES users(`id`),
    FOREIGN KEY (`to_id`) REFERENCES users(`id`),
    FOREIGN KEY (`question_id`) REFERENCES questions(`id`),
    PRIMARY KEY (`id`)
)