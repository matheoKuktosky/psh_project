import React, { Component, useState } from 'react';

class App extends Component{
  constructor(){
    super();
    this.state = {
      stats: [],
      nickname: '',
      pImage: '',
      timestamp: '',
      score: 0
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.submitStats = this.submitStats.bind(this);
    this.randomNumber = this.randomNumber.bind(this);  
  }
  
  submitStats(){      
  
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
      this.setState({stats: data.results});
      this.state.stats.map((p, i) => {
        let currentdate = new Date();
        let timestamp = currentdate.getDate() + "-"
        + (currentdate.getMonth()+1)  + "-" 
        + currentdate.getFullYear() + "  "  
        + (currentdate.getHours() < 10? "0":"") + currentdate.getHours() + ":"  
        + (currentdate.getMinutes() < 10? "0":"") + currentdate.getMinutes() + ":" 
        + (currentdate.getSeconds() < 10? "0":"") + currentdate.getSeconds();
        this.setState({
          nickname: p.login.username,
          pImage: p.picture.thumbnail,
          timestamp: timestamp,
          score: this.randomNumber(100,1)
        });
        this.submitStats();
        console.log(i, p.login.username, p.picture.thumbnail, this.randomNumber(100,1), timestamp);
      });      
    })
    .catch(error => {
      console.log(error);
    });
    setTimeout(this.componentDidMount, 5000);
  }
 
  render(){    
    const list = this.state.stats.map((p, i) => {
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
        <h1>stats:</h1>
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
