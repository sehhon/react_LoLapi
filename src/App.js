import React, { Component } from 'react';
import Search from './component/Search';
import { api_key } from './config/api_key';
import champions from 'lol-champions'
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';


class App extends Component {


  state = {
    value: '',
    win: '',
    lose: '',
    tier: '',
    rank: '',
    imgURL: '',
    championPoints: [],
    championId: [],
    verychampname: [],
    livegameuser : [],
    hi:{},


  }

  _getMovies = async () => {
    await this._callApi();
    await this._livegameApi();
   
  }

  _callApi = () => {
    console.log(this.state.value)
    return fetch(`lol/summoner/v4/summoners/by-name/${this.state.value}?api_key=${api_key}`)
      .then(res => res.json())
      .then(json => { console.log(json)
        fetch(`/lol/league/v4/entries/by-summoner/${json.id}?api_key=${api_key}`)
          .then(res => res.json())
          .then(data => {
            fetch(`lol/champion-mastery/v4/champion-masteries/by-summoner/${json.id}?api_key=${api_key}`)
              .then(res => res.json())
              .then(jsdata => {

                for (let i = 0; i < 5; i++) {
                  if (this.state.championPoints.length < 3) {
                    this.setState({
                      imgURL: json.profileIconId,
                      win: data[0].wins,
                      lose: data[0].losses,
                      tier: data[0].tier,
                      rank: data[0].rank,
                      championPoints: [...this.state.championPoints, jsdata[i].championPoints],
                      championId: [...this.state.championId, jsdata[i].championId]
                    })
                  }


                }
              }
              ).catch(err => console.log(err))
            if (this.state.championPoints.length === 3) {
              this.setState({
                championPoints: [],
                championId: []
              })
            }
          })
      })
  }

  _livegameApi = () =>{
    return fetch(`lol/summoner/v4/summoners/by-name/${this.state.value}?api_key=${api_key}`)
      .then(res => res.json())
      .then(json => { console.log(json)
     fetch(`lol/spectator/v4/active-games/by-summoner/${json.id}?api_key=${api_key}`)
    .then(res => res.json())
    .then(json2 => { console.log(json2)
      this.setState({
        hi : json2
      })
      console.log(this.state.hi)
      for(let i=0; i<json2.participants.length; i++){
        this.setState({
          livegameuser : [...this.state.livegameuser, json2.participants[i].summonerName]
        })
        console.log(this.state.livegameuser)
        console.log(this.state.hi)
      }
   
    }).catch(err => console.log(err))
    console.log(this.state.hi);})
  
  }

 


  _championlistapi = () => {
    const { championId } = this.state; //npm lol api
    let bb = [];
    let single;
   // console.log(String(championId));
    for (let i = 0; i < champions.length; i++) {
      for (let j = 0; j < championId.length; j++) {
        if (String(championId[j]) === champions[i].key) {
          bb.push(champions[i].name);
          //  single = bb.reduce((a, b) => {
          //   if (a.indexOf(b) < 0) a.push(b);
          //   return a;
          // }, []);
          console.log(single);
        }
      }
    }
    return bb;
    

  }

 

  _handleChange = (e) => {
    this.setState({
      value: e.target.value
    })

  }
  


  _championPoints = () => {
    const championPointlist = this.state.championPoints.map(
      (season, i) => (
        <li key={i}>숙련도 {i + 1}순위 {season}</li>
      )
    )
    return championPointlist;
  }

  _championId = () => {
    const prochampion = this.state.championId.map((prochamp, i) =>
      <div key={i}> {prochamp}</div>
    )
    return prochampion;
  }


  


  render() {
    // let imgUrl = `//opgg-static.akamaized.net/images/profile_icons/profileIcon${this.state.imgURL}.jpg`;
    // const { championPoints } = this.state;

    return (
      <div>
        <Search
          handleChange={this._handleChange}
          getData={this._getMovies}

        />

          
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          
        <Tab eventKey={1} title="솔로 랭크">
        <div>
        
          <b>솔로랭크</b>
          <br />
          
          <p>{this.state.tier} {this.state.rank}</p>
          <span>승:{this.state.win}</span>
          <br />
          <span>패:{this.state.lose}</span>
          <br />
{this.state.livegameuser}
          <ul>
            {this._championPoints()} {this._championId()}
       
          </ul>
          {this._championlistapi()}
          
              

   
        </div>
        
        </Tab>
        <Tab eventKey={2} title="자유 랭크">
          Tab 2 content
        </Tab>
        <Tab eventKey={3} title="솔로 + 자유 랭크" >
          Tab 3 content
        </Tab>
        <Tab eventKey={4} title="달다구리" >
          Tab 3 content
        </Tab>
      </Tabs>;
        
   

      </div>

    );


  }
}



export default App;


