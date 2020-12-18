import React, { Component } from 'react';
import Axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state = {
      players: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);        
  }

  submitStats(nickname, pImage, timestamp, score){
    Axios.post("http://localhost:3001/api/insert", 
    {
      nickname: nickname,
      pImage: pImage,
      timestamp: timestamp,
      score: score
    }).then(()=>{
      alert("Successful insert!");
    })
  };
  randomNumber(max, min){
    return Math.floor(Math.random() * (max + 1 - min)) + min; 
  }
  
  componentDidMount(){
    fetch(`https://randomuser.me/api/?results=${this.randomNumber(10, 0)}`).then(response =>{
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(data =>{
      this.setState({players: data.results});
      this.state.players.map((p, i) => {
        let currentdate = new Date();
        let timestamp = currentdate.getDate() + "-"
        + (currentdate.getMonth()+1)  + "-" 
        + currentdate.getFullYear() + "  "  
        + (currentdate.getHours() < 10? "0":"") + currentdate.getHours() + ":"  
        + (currentdate.getMinutes() < 10? "0":"") + currentdate.getMinutes() + ":" 
        + (currentdate.getSeconds() < 10? "0":"") + currentdate.getSeconds();
        console.log(i, p.login.username, p.picture.thumbnail, this.randomNumber(100,1), timestamp);
        this.submitStats(p.login.username, p.picture.thumbnail, this.randomNumber(100,1), timestamp);
      });      
    })
    .catch(error => {
      console.log(error);
    });
    setTimeout(this.componentDidMount, 5000);
  }
 
  render(){    
    const list = this.state.players.map((p, i) => {
      let currentdate = new Date();
      let timestamp = currentdate.getDate() + "-"
      + (currentdate.getMonth()+1)  + "-" 
      + currentdate.getFullYear() + "  "  
      + (currentdate.getHours() < 10? "0":"") + currentdate.getHours() + ":"  
      + (currentdate.getMinutes() < 10? "0":"") + currentdate.getMinutes() + ":" 
      + (currentdate.getSeconds() < 10? "0":"") + currentdate.getSeconds();
      return <Player key={i} username={p.login.username} profile={p.picture.thumbnail} score={this.randomNumber(100,1)} timestamp={timestamp} />;
    });
    return(
      <div>
        <h1>Players:</h1>
        {list}
      </div>
    );
  }
}

class Player extends Component{  
  render(){
      return(
          <div>
              <p>{this.props.username}</p>
              <p>{this.props.profile}</p>
              <p>{this.props.score}</p>
              <p>{this.props.timestamp}</p>
          </div>
      );
  }
}

export default App;
