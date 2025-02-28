import './App.css';
import fplLogo from './assets/fpl-logo.png';
import { useState, useEffect } from 'react';

const API_URL = 'http://35.211.255.92:8081';

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
        const response = await fetch(`${API_URL}/team/selector?gameweek=${gameweek}`);
        const data = await response.json();
        setTeamSelectorData(data);
      } catch (error) {
        console.error('Error fetching team selector data:', error);
      }
    };

    fetchGameweek();
  }, []);

  const handleRefresh = async () => {
    if (!gameweek) {
      console.error('Gameweek is not set');
      return;
    }

    try {
      await fetch(`${API_URL}/data/gameweekinput`);
      await Promise.all([
        fetch(`${API_URL}/models/predict?position=1&gameweek=${gameweek}`),
        fetch(`${API_URL}/models/predict?position=2&gameweek=${gameweek}`),
        fetch(`${API_URL}/models/predict?position=3&gameweek=${gameweek}`),
        fetch(`${API_URL}/models/predict?position=4&gameweek=${gameweek}`)
      ]);
      console.log('Refresh completed');
    } catch (error) {
      console.error('Error during refresh:', error);
    }
  };

  return (
    <div className="App">
      <div className="banner">
        <img src={fplLogo} alt="FPL Assistant Manager" className="fpl-logo"/>
        <button className="refresh-button" onClick={handleRefresh}>Refresh</button>
      </div>
      <header className="App-header">
        {gameweek ? <h2 className="next-gameweek">Next Gameweek: {gameweek}</h2> : <h2>Loading...</h2>}
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