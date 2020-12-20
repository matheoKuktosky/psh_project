drop database if exists sql_server;
create database sql_server;
use sql_server;
ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'admin';
flush privileges;

create table players (
	player_id int NOT NULL AUTO_INCREMENT,
    nickname varchar(255) NOT NULL,
    p_image varchar(255) NOT NULL,
    PRIMARY KEY (player_id)
);

create table stats (
    stat_id int NOT NULL AUTO_INCREMENT,
    player_id int NOT NULL,
    creation_date timestamp NOT NULL,
    score int NOT NULL,
    PRIMARY KEY (stat_id)    
);
SELECT players.nickname, players.p_image, stats.score, stats.creation_date 
FROM players
INNER JOIN stats ON players.player_id=stats.player_id
ORDER BY stats.score DESC LIMIT 10;
select * from players;
select * from stats;
