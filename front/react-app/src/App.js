import React, {Component} from 'react';

class App extends Component{
  constructor(){
    super();
    this.state = {
      stats: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.generateStats = this.generateStats.bind(this);
  }
  

  componentDidMount(){
    this.generateStats();
    setTimeout(this.componentDidMount, 5000);
  }

  generateStats = () =>{
    fetch('http://localhost:3001/api/insertStats')
    .then(response => response.json())
    .then(({data})=> {
      console.log(data);
    })
    .catch(err => console.log(err))
  }

  render(){
    return(
      <div>
        <p>meme</p>
      </div>
    );
  }
}

export default App;
