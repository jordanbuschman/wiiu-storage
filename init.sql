-- init.sql --

/*
Run on local database to set it up.
ONLY DO SO IF YOU ARE SURE YOU WANT TO CLEAR EVERYTHING

To execute, go to terminal and type:
    psql -h localhost -U postgres < init.sql
*/

\c wiiu-storage

DROP TABLE IF EXISTS Users, Salts;

CREATE TABLE Users (
    id SERIAL,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id));

CREATE TABLE Salts (
    id SERIAL,
    userId INTEGER NOT NULL UNIQUE,
    salt VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id));

INSERT INTO Users (username, password, createdAt, updatedAt) VALUES ('jordan', 'test', NOW(), NOW());
INSERT INTO Salts (userId, salt, createdAt, updatedAt) VALUES(1, 'asdasdasdasdas', NOW(), NOW());
