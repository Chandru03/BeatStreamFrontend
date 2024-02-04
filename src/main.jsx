import React from 'react';
import ReactDOM from 'react-dom/client';
import YouTubeAudioPlayer from './assets/Player.jsx';
import MusicList from './MusicList.jsx';

const App = () => {
  return (
    <React.StrictMode>
        <MusicList/>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
