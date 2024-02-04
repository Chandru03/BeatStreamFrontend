import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './Player.css'

const YouTubeAudioPlayer = ({ videoId }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  const toggleAudio = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressBarClick = (event) => {
    if (player) {
      const progressBar = event.target;
      const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
      const percentage = (clickPosition / progressBar.offsetWidth) * 100;
      const seekTime = (percentage / 100) * duration;
      player.seekTo(seekTime, true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='playerGroup'>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />

      <div className='playerButton'>
        <button className='playButton' onClick={toggleAudio}>
          {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none">
  <g clip-path="url(#clip0_1350_605)">
    <path d="M1.29883 15.9082H3.52539C4.375 15.9082 4.82422 15.459 4.82422 14.5996V1.29883C4.82422 0.410156 4.375 0 3.52539 0H1.29883C0.449219 0 0 0.449219 0 1.29883V14.5996C0 15.459 0.449219 15.9082 1.29883 15.9082ZM8.39844 15.9082H10.6152C11.4746 15.9082 11.9141 15.459 11.9141 14.5996V1.29883C11.9141 0.410156 11.4746 0 10.6152 0H8.39844C7.53906 0 7.08984 0.449219 7.08984 1.29883V14.5996C7.08984 15.459 7.53906 15.9082 8.39844 15.9082Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1350_605">
      <rect width="12.2754" height="15.9082" fill="white"/>
    </clipPath>
  </defs>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
  <g clip-path="url(#clip0_1350_613)">
    <path d="M3.04688 16.5527C3.4375 16.5527 3.76953 16.3965 4.16016 16.1719L15.5469 9.58984C16.3574 9.11133 16.6406 8.79883 16.6406 8.28125C16.6406 7.76367 16.3574 7.45117 15.5469 6.98242L4.16016 0.390625C3.76953 0.166016 3.4375 0.0195312 3.04688 0.0195312C2.32422 0.0195312 1.875 0.566406 1.875 1.41602V15.1465C1.875 15.9961 2.32422 16.5527 3.04688 16.5527Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1350_613">
      <rect width="16.6406" height="16.5527" fill="white"/>
    </clipPath>
  </defs>
</svg>}
        </button>
        <div onClick={handleProgressBarClick} style={{ cursor: 'pointer' }}>
        <div className='timeStamp'> {formatTime(currentTime)} / {formatTime(duration)} </div>
          <div style={{ width: '100%', height: '10px', background: '#ccc', borderRadius:'10px'}}>
            <div
              style={{
                width: `${(currentTime / duration) * 100}%`,
                height: '100%',
                background: '#F95738',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeAudioPlayer;
