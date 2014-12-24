-- init.sql --

/*
Run on local database to set it up.
ONLY DO SO IF YOU ARE SURE YOU WANT TO CLEAR EVERYTHING

To execute, go to terminal and type:
    psql -h localhost -U postgres < init.sql
*/

-- Uncomment for local usage
--\c wiiu-storage

DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "Files";

CREATE TABLE "Users" (
    id SERIAL,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id));

CREATE TABLE "Files" (
    id SERIAL,
    "userId" INTEGER NOT NULL,
    "fileName" VARCHAR(255) NOT NULL UNIQUE,
    salt VARCHAR(64) NOT NULL,
    "hmacKey" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id));
