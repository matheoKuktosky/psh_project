drop database if exists sql_server;
create database sql_server;
use sql_server;
ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'admin';
flush privileges;

create table stats (
    stat_id int NOT NULL AUTO_INCREMENT,
    nickname varchar(255) NOT NULL,
    p_image varchar(255) NOT NULL,
    creation_date timestamp NOT NULL,
    score int NOT NULL,
    PRIMARY KEY (stat_id)    
);
select * from stats;
insert into stats (nickname, p_image, creation_date, score) values ("toninho", "img", "1970-01-01 00:00:01", 100);