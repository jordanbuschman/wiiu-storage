-- init.sql --

/*
Run on local database to set it up.
ONLY DO SO IF YOU ARE SURE YOU WANT TO CLEAR EVERYTHING

To execute, go to terminal and type:
    psql -h localhost -U postgres < init.sql
*/

CREATE DATABASE IF NOT EXISTS wiiu-storage;
\c wiiu-storage
 
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(64) NOT NULL,
    PRIMARY KEY (id));
