import React, { useState, useEffect } from 'react';
import YouTubeAudioPlayer from './assets/Player';
import './assets/Player.css';

const MusicList = () => {
  const [musicList, setMusicList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoArtist, setSelectedVideoArtist] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAddMusicOverlay, setShowAddMusicOverlay] = useState(false); // New state for the second overlay

  
  const [newMusicData, setNewMusicData] = useState({
    title: '',
    artist: '',
    year: '',
    thumbnail: '',
    youtubeLink: '',
  });

  const fetchMusicData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch music data. Status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched music data:', data);
      setMusicList(data);
      setSearchNotFound(!data || (Array.isArray(data) && data.length === 0));
    } catch (error) {
      console.error('Error fetching music data:', error.message);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const formattedSearchTerm = searchTerm
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const endpoint =
        searchType === 'title'
          ? `http://localhost:8080/api/music/${encodeURIComponent(formattedSearchTerm)}`
          : `http://localhost:8080/api/music/artist/${encodeURIComponent(formattedSearchTerm)}`;

      fetchMusicData(endpoint);
    } else {
      fetchAllMusic();
    }
  };

  const fetchAllMusic = () => {
    const endpoint = 'http://localhost:8080/api/music';
    fetchMusicData(endpoint);
  };

  useEffect(() => {
    fetchAllMusic();
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
  };

  const handleThumbnailClick = (videoId, thumbnail, title, artist) => {
    setSelectedVideoId(videoId);
    setSelectedVideoThumbnail(thumbnail);
    setSelectedVideoArtist(artist);
    setSelectedVideoTitle(title);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setShowAddMusicOverlay(false); // Close the second overlay as well
  };

  const handleAddMusic = () => {
    setShowAddMusicOverlay(true); // Show the second overlay when "Add Music" is clicked
  };

  const handleAddMusicSubmit = async () => {
    try {
      // Extract videoId from the YouTube link
      const videoId = extractVideoId(newMusicData.youtubeLink);
  
      // Prepare the data for submission
      const newMusicEntry = {
        title: newMusicData.title,
        artist: newMusicData.artist,
        year: newMusicData.year,
        thumbnail: newMusicData.thumbnail,
        link: videoId,
      };
  
      // Perform the POST request to api/music/create with newMusicEntry
      const response = await fetch('http://localhost:8080/api/music/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMusicEntry),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add new music. Status: ${response.status} ${response.statusText}`);
      }
  
      // Handle successful submission, e.g., show a success message or update the music list
      console.log('New music added successfully');
  
      // Close the overlay after successful submission
      setShowAddMusicOverlay(false);
    } catch (error) {
      console.error('Error adding new music:', error.message);
      // Handle errors, e.g., show an error message to the user
    }
  };
  

  const extractVideoId = (youtubeLink) => {
    const match = youtubeLink.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div>
      <div className='nav'>
        <div className='navContent'>
          <h2 className='logoName'><span>Beat</span>Stream</h2>
          <div>
            <input className='searchBar'
              type="text"
              placeholder="Search by title or artist"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className='searchButton' onClick={handleSearch}>Search</button>
            
          </div>
        </div>
        <button className='searchButton' onClick={handleAddMusic}>
              Add Music
            </button>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="title"
            className="radio"
            checked={searchType === 'title'}
            onChange={() => handleSearchTypeChange('title')}
          />
          Search by Title
        </label>
        <label>
          <input
            type="radio"
            className="radio"
            value="artist"
            checked={searchType === 'artist'}
            onChange={() => handleSearchTypeChange('artist')}
          />
          Search by Artist
        </label>
      </div>
      {searchNotFound ? (
        <p>Search Not Found</p>
      ) : (
        <ul>
          {Array.isArray(musicList) ? (
            musicList.map((music) => (
              <li key={music.id} onClick={() => handleThumbnailClick(music.link, music.thumbnail, music.title, music.artist)}>
                <strong>Title:</strong> {music.title}, <strong>Artist:</strong> {music.artist}
                <br />
                <img
                  src={music.thumbnail}
                  alt={`Thumbnail for ${music.title}`}
                  style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                />
              </li>
            ))
          ) : (
            <li key={musicList.id} onClick={() => handleThumbnailClick(musicList.link, musicList.thumbnail, music.title, music.artist)}>
              <strong>Title:</strong> {musicList.title}, <strong>Artist:</strong> {musicList.artist}
              <br />
              <img
                src={musicList.thumbnail}
                alt={`Thumbnail for ${musicList.title}`}
                style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
              />
            </li>
          )}
        </ul>
      )}
      {showOverlay && (
        <div className="overlay">
          <div className='player'>
            <img className='thumbnail'
              src={selectedVideoThumbnail}
              alt="Thumbnail for selected song"
            />
            <h2 className='playingTitle'>{selectedVideoTitle}</h2>
            <h2 className='playingArtist'>{selectedVideoArtist} </h2>
            <YouTubeAudioPlayer videoId={selectedVideoId} />
          </div>
          <button className='closeButton' onClick={closeOverlay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <g clip-path="url(#clip0_1352_622)">
                <path d="M9.96094 19.9219C15.4102 19.9219 19.9219 15.4004 19.9219 9.96094C19.9219 4.51172 15.4004 0 9.95117 0C4.51172 0 0 4.51172 0 9.96094C0 15.4004 4.52148 19.9219 9.96094 19.9219ZM9.96094 18.2617C5.35156 18.2617 1.66992 14.5703 1.66992 9.96094C1.66992 5.35156 5.3418 1.66016 9.95117 1.66016C14.5605 1.66016 18.2617 5.35156 18.2617 9.96094C18.2617 14.5703 14.5703 18.2617 9.96094 18.2617Z" fill="black" fill-opacity="0.85"/>
                <path d="M6.62109 14.0918C6.8457 14.0918 7.04102 14.0039 7.1875 13.8477L9.95117 11.0742L12.7344 13.8477C12.8809 13.9941 13.0664 14.0918 13.291 14.0918C13.7207 14.0918 14.0723 13.7402 14.0723 13.3008C14.0723 13.0762 13.9941 12.9004 13.8379 12.7441L11.0645 9.9707L13.8477 7.17773C14.0137 7.01172 14.082 6.8457 14.082 6.63086C14.082 6.20117 13.7305 5.84961 13.3008 5.84961C13.0957 5.84961 12.9297 5.92773 12.7637 6.09375L9.95117 8.87695L7.16797 6.10352C7.02148 5.94727 6.8457 5.86914 6.62109 5.86914C6.19141 5.86914 5.83984 6.21094 5.83984 6.64062C5.83984 6.85547 5.92773 7.04102 6.07422 7.1875L8.84766 9.9707L6.07422 12.7539C5.92773 12.9004 5.83984 13.0859 5.83984 13.3008C5.83984 13.7402 6.19141 14.0918 6.62109 14.0918Z" fill="black" fill-opacity="0.85"/>
              </g>
              <defs>
                <clipPath id="clip0_1352_622">
                  <rect width="20.2832" height="19.9316" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      )}
      {showAddMusicOverlay && (
        <div className="overlay">
          <div className='addMusicForm'>
            <label>
              Track Title:
              <input
                type="text"
                value={newMusicData.title}
                onChange={(e) => setNewMusicData({ ...newMusicData, title: e.target.value })}
              />
            </label>
            <label>
              Artist:
              <input
                type="text"
                value={newMusicData.artist}
                onChange={(e) => setNewMusicData({ ...newMusicData, artist: e.target.value })}
              />
            </label>
            <label>
              Year:
              <input
                type="text"
                value={newMusicData.year}
                onChange={(e) => setNewMusicData({ ...newMusicData, year: e.target.value })}
              />
            </label>
            <label>
              Thumbnail Link:
              <input
                type="text"
                value={newMusicData.thumbnail}
                onChange={(e) => setNewMusicData({ ...newMusicData, thumbnail: e.target.value })}
              />
            </label>
            <label>
              YouTube Link:
              <input
                type="text"
                value={newMusicData.youtubeLink}
                onChange={(e) => setNewMusicData({ ...newMusicData, youtubeLink: e.target.value })}
              />
            </label>
            <button onClick={handleAddMusicSubmit}>Submit</button>
          </div>
          <button className='closeButton' onClick={closeOverlay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <g clip-path="url(#clip0_1352_622)">
                <path d="M9.96094 19.9219C15.4102 19.9219 19.9219 15.4004 19.9219 9.96094C19.9219 4.51172 15.4004 0 9.95117 0C4.51172 0 0 4.51172 0 9.96094C0 15.4004 4.52148 19.9219 9.96094 19.9219ZM9.96094 18.2617C5.35156 18.2617 1.66992 14.5703 1.66992 9.96094C1.66992 5.35156 5.3418 1.66016 9.95117 1.66016C14.5605 1.66016 18.2617 5.35156 18.2617 9.96094C18.2617 14.5703 14.5703 18.2617 9.96094 18.2617Z" fill="black" fill-opacity="0.85"/>
                <path d="M6.62109 14.0918C6.8457 14.0918 7.04102 14.0039 7.1875 13.8477L9.95117 11.0742L12.7344 13.8477C12.8809 13.9941 13.0664 14.0918 13.291 14.0918C13.7207 14.0918 14.0723 13.7402 14.0723 13.3008C14.0723 13.0762 13.9941 12.9004 13.8379 12.7441L11.0645 9.9707L13.8477 7.17773C14.0137 7.01172 14.082 6.8457 14.082 6.63086C14.082 6.20117 13.7305 5.84961 13.3008 5.84961C13.0957 5.84961 12.9297 5.92773 12.7637 6.09375L9.95117 8.87695L7.16797 6.10352C7.02148 5.94727 6.8457 5.86914 6.62109 5.86914C6.19141 5.86914 5.83984 6.21094 5.83984 6.64062C5.83984 6.85547 5.92773 7.04102 6.07422 7.1875L8.84766 9.9707L6.07422 12.7539C5.92773 12.9004 5.83984 13.0859 5.83984 13.3008C5.83984 13.7402 6.19141 14.0918 6.62109 14.0918Z" fill="black" fill-opacity="0.85"/>
              </g>
              <defs>
                <clipPath id="clip0_1352_622">
                  <rect width="20.2832" height="19.9316" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicList;
