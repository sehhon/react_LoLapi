import React, { Component } from 'react';
import Search from './component/Search';
import { api_key } from './config/api_key'


class App extends Component {


  state = {
    value: '',
    win: '',
    lose: '',
    tier: '',
    rank: '',
    //imgURL: '',
    championPoints: [],
    
    
  }
  componentWillMount() {
    console.log('componentWillMount');
  }

  componentDidMount() {
    if(this.state.championPoints<6){
      console.log('componentDidMount');
     console.log("this.state.championPoints<"+this.state.championPoints)
    }else{
      window.location.reload();
    }
  }
  

  _getMovies = async () => {
     await this._callApi();
     
  }
  

  _callApi = () => {
    return fetch(`lol/summoner/v4/summoners/by-name/${this.state.value}?api_key=${api_key}`)
      .then(res => res.json())
      .then(json => {
        fetch(`/lol/league/v4/entries/by-summoner/${json.id}?api_key=${api_key}`)
          .then(res => res.json())
          .then(data => {
            fetch(`lol/champion-mastery/v4/champion-masteries/by-summoner/${json.id}?api_key=${api_key}`)
              .then(res => res.json())
              .then(jsdata => {
                for (let i = 0; i < 5; i++) {
                  
                  this.setState({
                    //imgURL: json.profileIconId,
                    win: data[0].wins,
                    lose: data[0].losses,
                    tier: data[0].tier,
                    rank: data[0].rank,

                    championPoints:[ ...this.state.championPoints ,jsdata[i].championPoints]
                  
                  })
                  
                  console.log(this.state)
                }
                
              
              })  
          })
      })
  }
  

  // _championlevel = () => {
  //   return fetch(`lol/summoner/v4/summoners/by-name/${this.state.value}?api_key=${api_key}`)
  //   .then(res => res.json())
  //   .then(json => { 
  //     console.log(json)
  //     fetch(`lol/champion-mastery/v4/champion-masteries/by-summoner/${json.id}?api_key=${api_key}`)
  //     .then(res => res.json())
  //     .then(data => this.setState({
  //       championLv:data[0].championLevel
  //     }))
  //   })
  // }

  _handleChange = (e) => {
    this.setState({
      value: e.target.value,
      
    })
   
  }
  _dd =  ()  => {
    const { championPoints } = this.state;
    const seasonList = championPoints.map(
      (season, i) => (
        <li key={i}>숙련도 {i+1}순위 {season}</li>
      )
    );
    return seasonList ;
  }

  
  render() {
    
    //let imgUrl = `//opgg-static.akamaized.net/images/profile_icons/profileIcon${this.state.imgURL}.jpg`;
    


    return (
      
      <div>
        <Search
          handleChange={this._handleChange}
          getData={this._getMovies}

        />
        <div>
          <b>솔로랭크</b>
          {/* <br />
          <img alt='' src={imgUrl} /> */}
          <p>{this.state.tier} {this.state.rank}</p>
          <span>승:{this.state.win}</span>
          <br />
          <span>패:{this.state.lose}</span>
          <br />
          
    

        <ul>
        <div> {this._dd()} </div>
        </ul>
      </div>
          
      
      </div>
      
    );

    
  }
}



export default App;
