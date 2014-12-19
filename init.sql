DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(64) NOT NULL,
    PRIMARY KEY (id));
