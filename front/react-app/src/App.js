import React, {Component} from 'react';
import './style.css';

class App extends Component{
  constructor(){
    super();
    this.state = {
      stats: [],
      timeStamp: "",
      position: 1,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getTopTen = this.getTopTen.bind(this);
    this.renderStat = this.renderStat.bind(this);
    this.render = this.render.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
    this._exportCSV = this._exportCSV.bind(this);
  }
  

  componentDidMount(){
    this.getTopTen();
    setTimeout(this.componentDidMount, 10000);
  }

  getTopTen = () =>{
    fetch('http://localhost:3001/api/topten')
    .then(response => response.json())
    .then(response => {
      this.setState({ stats: response.data });
      this.setState({timeStamp: response.statsTime})
      this.setState({position: 1});
    })
    .catch(err => console.log(err))    
  }

  exportCSV = () =>{
    fetch('http://localhost:3001/api/exportCSV')
    .then(response => response.text())
    .then(response => this._exportCSV(response))
    .catch(err => console.log(err))
  }

  _exportCSV = (csv) =>{
    const blob = new Blob([csv], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "report.csv";
    link.href = url;
    link.click();
  }

  renderStat = ({nickname, p_image, score, creation_date, stat_id}) => 
  <tr key={stat_id}>
    <td>{this.state.position++}</td>
    <td><img src={p_image} alt="Avatar"></img></td>   
    <td>{nickname}</td>
    <td>{score}</td>
    <td>{creation_date}</td>
  </tr>

  render(){
    const {stats} = this.state;
    return(
      <div className="App">
        <main>
          <table className="center">
          <tr>
            <th>Position</th>
            <th>Thumb</th>
            <th>Player</th>
            <th>Score</th>
            <th>Stat Creation</th>
          </tr>
          {stats.map(this.renderStat)}
          </table>         
          <div className="info">
            <p> LAST STATS INSERT TIME: {this.state.timeStamp}</p>
            <button onClick={() => {this.exportCSV()}}>Export Report</button>
          </div>           
        </main>        
      </div>
    );
  }
}

export default App;
