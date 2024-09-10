-- @block get groups from user
SELECT * FROM memberships
INNER JOIN groups
ON groups.id = memberships.group_id
WHERE memberships.user_id = 1;

-- @block get users from group
SELECT * FROM memberships
INNER JOIN users
ON users.id = memberships.user_id
WHERE memberships.group_id = 1;

-- @block get daily question
SELECT * FROM questions
WHERE group_id = 1
AND date = CURRENT_DATE();

-- @block get votes
SELECT * FROM votes
WHERE question_id = 1;

-- @block post user
INSERT INTO users(
    `id`,
    `username`,
    `password`
) VALUES
(
    NULL,
    'testuser1',
    'testpass1'
);

-- @block post group
INSERT INTO groups(
    `id`,
    `name`
) VALUES
(
    NULL,
    'testgroup1'
);

-- @block post vote
INSERT INTO votes(
    `id`,
    `from_id`,
    `to_id`,
    `question_id`
) VALUES
(
    NULL,
    '1',
    '1',
    '1'
);

-- @block add user to group
INSERT INTO memberships(
    `id`,
    `user_id`,
    `group_id`
) VALUES
(
    NULL,
    '1',
    '1'
);

-- @block remove user from group
DELETE FROM memberships
WHERE `user_id` = '1'
AND `group_id` = '1';