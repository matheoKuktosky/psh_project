const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fetch = require('node-fetch');

const api = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'sql_server'
});

db.connect(err => {
    if(err) return err;
});

api.use(cors());

const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min; 
}

const createStats = async () =>{
    try{
        fetch(`https://randomuser.me/api/?results=${randomNumber(10, 0)}`).then(response =>{
            if(response.ok) return response.json();
          })
          .then(data =>{
              const stats = data.results;
              stats.map(async (p) =>{
                  let currentdate = new Date();
                  let timestamp = currentdate.getFullYear() + "-" 
                  + (currentdate.getMonth()+1)  + "-"
                  + currentdate.getDate() + "  "            
                  + (currentdate.getHours() < 10? "0":"") + currentdate.getHours() + ":"  
                  + (currentdate.getMinutes() < 10? "0":"") + currentdate.getMinutes() + ":" 
                  + (currentdate.getSeconds() < 10? "0":"") + currentdate.getSeconds();
                  let username = p.login.username;
                  let playerId = await getPlayerId(username);
                  let exists =  playerId != 0;
                  console.log(exists);
                  if(!exists) insertPlayer(username, p.picture.thumbnail);
                  playerId = await getPlayerId(username);
                  insertStats(playerId, timestamp, randomNumber(100, 1));
                  console.log("GOOD");
              });
                    
          })
          .catch(error => {
            console.log(error);
          });
    }
    catch{
        createStats();
    }    
    
  }

  const getPlayerId = async (nickname)  =>{      
      return new Promise(resolve => {
        const SELECT_PLAYER = `SELECT player_id FROM players WHERE nickname="${nickname}"`;
        let id = 0;
        const query = db.query(SELECT_PLAYER);
        query
        .on('error', () => {
            if (err) throw err;
        })

        .on('result', (row) => {
            id = row.player_id;
        })

        .on('end', () => {
            resolve(id);
        });
      });
  }

  const insertPlayer = (nickname, pImage) =>{
    const INSERT_PLAYER_QUERY = `INSERT INTO players (nickname, p_image) VALUES ("${nickname}", "${pImage}")`;
    db.query(INSERT_PLAYER_QUERY, (err, results) => {
        if(err) console.log(err);
        else console.log("Inserted Player");
    });
  }

  const insertStats = (playerId, timestamp, score) =>{
    const INSERT_STATS_QUERY = `INSERT INTO stats (player_id, creation_date, score) VALUES (${playerId}, "${timestamp}" , ${score})`;
    db.query(INSERT_STATS_QUERY, (err, results) => {
        if(err) console.log(err);
        else console.log("Inserted Stat");
    });
  }

createStats();


// api.get('/api/insert', (req, res) => {
//     const {nickName, pImage, timestamp, score} = req.query;
//     const INSERT_STATS_QUERY = `INSERT INTO stats (nickname, p_image, creation_date, score) VALUES (${nickName}, ${pImage} , ${timestamp} , ${score})`;
//     db.query(INSERT_STATS_QUERY, (err, results) => {
//         if(err) return res.send(err);
//         else return res.send('successfully added stats!');
//     });
// });


api.listen(3001, () =>{
    console.log("running on port 3001");
});