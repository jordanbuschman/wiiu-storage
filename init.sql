DROP TABLE IF EXISTS users, oauth;

CREATE TABLE users (
    id SERIAL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL,
    oauth INT DEFAULT NULL,
    PRIMARY KEY (id));

CREATE TABLE oauth (
    id SERIAL,
    value VARCHAR(32) NOT NULL,
    PRIMARY KEY (id));
