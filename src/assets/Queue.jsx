import React, { useState, useEffect } from 'react';
import './Queue.css'

const Queue = ({ queue }) => {
    return (
      <div className='queuePanel'>
       <div className='queueTitle'>
       <h2>Playing Next</h2>
       </div>
        <div className='queueList'>
        <ul>
          {queue.map((music, index) => (
            <li key={index}>
              <img src={music.thumbnail} alt={`Thumbnail for ${music.title}`} />
              <div className='queueTrackInfo'>
                <span>{music.title}</span>
                <p>{music.artist}</p>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </div>
    );
  };
  

export default Queue;