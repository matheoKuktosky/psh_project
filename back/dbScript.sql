drop database if exists sql_server;
create database sql_server;
use sql_server;

create table stats (
    stat_id int NOT NULL AUTO_INCREMENT,
    nickname varchar(255) NOT NULL,
    p_image varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    score int NOT NULL,
    PRIMARY KEY (stat_id)    
);