const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fetch = require('node-fetch');
const cron = require('node-cron');
const json2csvParser = require('json2csv').Parser;
const fs = require('fs');


const SELECT_TOP10_QUERY = 
      `SELECT players.nickname, players.p_image, stats.score, stats.creation_date, stats.stat_id 
      FROM players
      INNER JOIN stats ON players.player_id=stats.player_id
      ORDER BY stats.score DESC LIMIT 10;`;

const api = express();

let statsTimeStamp = "";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'sql_server'
});

db.connect(err => {
    if(err) console.log(err);
});


/*let exportCSV = (req, res) => {
    db.query(SELECT_TOP10_QUERY, (err, results, fields) => {
        if(err) throw err;    
        const jsonData = JSON.parse(JSON.stringify(results));
        const json2csvP = new json2csvParser({header: true});
        const csv = json2csvP.parse(jsonData);
        res.send(csv);
        fs.writeFile("report.csv", csv, (err) =>{
            if(err) throw err;
            console.log("CSV export done!");
        });
      });
}*/

api.use(cors());

const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min; 
}

const getTimeStamp = () => {
    let currentdate = new Date();
    let timestamp = currentdate.getFullYear() + "-" 
    + (currentdate.getMonth()+1)  + "-"
    + currentdate.getDate() + "  "            
    + (currentdate.getHours() < 10? "0":"") + currentdate.getHours() + ":"  
    + (currentdate.getMinutes() < 10? "0":"") + currentdate.getMinutes() + ":" 
    + (currentdate.getSeconds() < 10? "0":"") + currentdate.getSeconds();
    return timestamp;
}

const createStats = async () =>{
    try{        
        fetch(`https://randomuser.me/api/?results=${randomNumber(10, 0)}`).then(response =>{
            if(response.ok) return response.json();
          })
          .then(data =>{
              const stats = data.results;
              stats.map(async (p) =>{
                  let timestamp = getTimeStamp();
                  let username = p.login.username;                
                  let playerId = await getPlayerId(username);
                  let exists =  playerId != 0;
                  if(!exists) await insertPlayer(username, p.picture.thumbnail);
                  playerId = await getPlayerId(username);
                  await insertStats(playerId, timestamp, randomNumber(100, 1));                  
                  //console.log("GOOD");
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

  const insertPlayer = async (nickname, pImage) =>{
    const INSERT_PLAYER_QUERY = `INSERT INTO players (nickname, p_image) VALUES ("${nickname}", "${pImage}")`;
    db.query(INSERT_PLAYER_QUERY, (err, results) => {
        if(err) console.log(err);
        //else console.log("Inserted Player");
    });
  }

  const insertStats = async (playerId, timestamp, score) =>{
    const INSERT_STATS_QUERY = `INSERT INTO stats (player_id, creation_date, score) VALUES (${playerId}, "${timestamp}" , ${score})`;
    db.query(INSERT_STATS_QUERY, (err, results) => {
        if(err) console.log(err);
        //else console.log("Inserted Stat");
    });
  }

  api.get('/api/exportCSV', async (req, res)=>{
    db.query(SELECT_TOP10_QUERY, (err, results, fields) => {
        if(err) throw err;    
        const jsonData = JSON.parse(JSON.stringify(results));
        const json2csvP = new json2csvParser({header: true});
        const csv = json2csvP.parse(jsonData);
        res.send(csv);
      });  
  });

  api.get('/api/topten', (req, res)=>{      
      db.query(SELECT_TOP10_QUERY, (err, results) => {
        if(err) return res.send(err);
        else{
            return res.json({
                data: results,
                statsTime: statsTimeStamp
            })
        }
      });
  });

cron.schedule("*/10 * * * * *", () => {
    createStats();
    statsTimeStamp = getTimeStamp();
    console.log("cron executed");
});

api.listen(3001, () =>{
    console.log("running on port 3001");
});