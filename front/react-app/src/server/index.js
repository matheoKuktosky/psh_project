const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'sql_server'
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/insert", (req, res)=>{
    const nickName = req.body.nickName;
    const pImage = req.body.pImage;
    const timestamp = req.body.timestamp;
    const score = req.body.score;
    const sqlInsert = "insert into stats (nickname, p_image, creation_date, score) values (?, ?, ?, ?)";
    db.query(sqlInsert, [nickName, pImage, timestamp, score], (err, result)=>{
        console.log(err);
    });
});

app.listen(3001, () =>{
    console.log("running on port 3001");
});