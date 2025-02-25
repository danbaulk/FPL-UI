import './App.css';
import fplLogo from './assets/fpl-logo.png';
import { useState, useEffect } from 'react';

function App() {
  const [gameweek, setGameweek] = useState(null);
  const [teamSelectorData, setTeamSelectorData] = useState(null);

  useEffect(() => {
    const fetchGameweek = async () => {
      try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        const data = await response.json();
        const nextGameweek = data.events.find(event => event.is_next);
        if (nextGameweek) {
          setGameweek(nextGameweek.id);
          fetchTeamSelector(nextGameweek.id);
        } else {
          console.error('No next gameweek found');
        }
      } catch (error) {
        console.error('Error fetching gameweek:', error);
      }
    };

    const fetchTeamSelector = async (gameweek) => {
      try {
        const response = await fetch(`http://localhost:8081/team/selector?gameweek=${gameweek}`);
        const data = await response.json();
        setTeamSelectorData(data);
      } catch (error) {
        console.error('Error fetching team selector data:', error);
      }
    };

    fetchGameweek();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={fplLogo} alt="FPL Assistant Manager" className="fpl-logo"/>
        {gameweek ? <h2>Next Gameweek: {gameweek}</h2> : <h2>Loading...</h2>}
        {teamSelectorData && (
          <div className="formation">
            <div className="forwards">
              {teamSelectorData.forwards.map(player => (
                <div key={player.ID} className="player">{player.Name}</div>
              ))}
            </div>
            <div className="midfielders">
              {teamSelectorData.midfielders.map(player => (
                <div key={player.ID} className="player">{player.Name}</div>
              ))}
            </div>
            <div className="defenders">
              {teamSelectorData.defenders.map(player => (
                <div key={player.ID} className="player">{player.Name}</div>
              ))}
            </div>
            <div className="goalkeepers">
              {teamSelectorData.goalkeepers.map(player => (
                <div key={player.ID} className="player">{player.Name}</div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;