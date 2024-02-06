/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import YouTubeAudioPlayer from "./assets/Player";
import "./assets/Player.css";
import Queue from "./assets/Queue";

const MusicList = () => {
  const [musicList, setMusicList] = useState([]); //list of all music
  const [searchTerm, setSearchTerm] = useState(""); // searched term
  const [searchType, setSearchType] = useState("title"); // search type as title as defualt
  const [searchNotFound, setSearchNotFound] = useState(false); //search not found
  const [selectedVideoId, setSelectedVideoId] = useState(null); // videoId
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState(null); // thumbnail
  const [selectedVideoArtist, setSelectedVideoArtist] = useState(null); //artist
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null); //  title
  const [showOverlay, setShowOverlay] = useState(false); // first overlay
  const [showAddMusicOverlay, setShowAddMusicOverlay] = useState(false); // second overlay
  const [queue, setQueue] = useState([]); // queue
  const [isRepeatTrack, setIsRepeatTrack] = useState(false); // track repeat

  const addToQueue = (music) => {
    setQueue([...queue, music]);
  };

  const handleAddToQueue = (music) => {
    setQueue([...queue, music]);
  };

  const [newMusicData, setNewMusicData] = useState({
    title: "",
    artist: "",
    year: "",
    thumbnail: "",
    youtubeLink: "",
  });

  const fetchMusicData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch music data. Status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched music data:", data);
      setMusicList(data);
      setSearchNotFound(!data || (Array.isArray(data) && data.length === 0));
    } catch (error) {
      console.error("Error fetching music data:", error.message);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      const formattedSearchTerm = searchTerm
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const endpoint =
        searchType === "title"
          ? `http://localhost:8080/api/music/${encodeURIComponent(
              formattedSearchTerm
            )}`
          : `http://localhost:8080/api/music/artist/${encodeURIComponent(
              formattedSearchTerm
            )}`;

      fetchMusicData(endpoint);
    } else {
      fetchAllMusic();
    }
  };

  const fetchAllMusic = () => {
    const endpoint = "http://localhost:8080/api/music";
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

    const selectedMusic = {
      videoId,
      thumbnail,
      artist,
      title,
    };
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
      const response = await fetch("http://localhost:8080/api/music/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMusicEntry),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add new music. Status: ${response.status} ${response.statusText}`
        );
      }

      // Handle successful submission,
      console.log("New music added successfully");

      // Close the overlay after successful submission
      setShowAddMusicOverlay(false);
    } catch (error) {
      console.error("Error adding new music:", error.message);
      // Handle errors
    }
  };

  const extractVideoId = (youtubeLink) => {
    const match = youtubeLink.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playNextTrack = () => {
    if (isRepeatTrack) {
      // Repeat the current track
      // Reset current track to the beginning
      setPlayer((prevPlayer) => {
        if (prevPlayer) {
          prevPlayer.seekTo(0, true);
          //  delay before starting again
          setTimeout(() => {
            prevPlayer.playVideo(); // Start playing again
          }, 1000);
        }
        return prevPlayer;
      });
    } else {
      // Play the next track
      if (currentTrackIndex < queue.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      }
    }
  };
  
  
  

  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  useEffect(() => {
    // update player when the current track index changes
    if (queue.length > 0) {
      const currentTrack = queue[currentTrackIndex];
      setSelectedVideoId(currentTrack.link);
      setSelectedVideoThumbnail(currentTrack.thumbnail);
      setSelectedVideoArtist(currentTrack.artist);
      setSelectedVideoTitle(currentTrack.title);
    }
  }, [currentTrackIndex, queue]);

  const toggleRepeatTrack = () => {
    setIsRepeatTrack(!isRepeatTrack);
  };

  const handleDeleteTrack = (index) => {
    // a new copy of the queue array without the track at the index
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  };


  return (
    <>
      <div className="nav">
        <div className="navContent">
          <h2 className="logoName">
            <span>Beat</span>Stream
          </h2>
          <div>
            <input
              className="searchBar"
              type="text"
              placeholder="Search by title or artist"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className="searchButton" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <button className="searchButton" onClick={handleAddMusic}>
          Add Music
        </button>
      </div>

      <div className="sections">
        <div className="leftPanel">
          <div>
            <label>
              <input
                type="radio"
                value="title"
                className="radio"
                checked={searchType === "title"}
                onChange={() => handleSearchTypeChange("title")}
              />
              Search by Title
            </label>
            <label>
              <input
                type="radio"
                className="radio"
                value="artist"
                checked={searchType === "artist"}
                onChange={() => handleSearchTypeChange("artist")}
              />
              Search by Artist
            </label>
          </div>
          {searchNotFound ? (
            <p>Search Not Found</p>
          ) : (
            <ul className="musicArray">
              {Array.isArray(musicList) ? (
                musicList.map((music) => (
                  <li key={music.id}>
                    <br />
                    <img
                      onClick={() =>
                        handleThumbnailClick(
                          music.link,
                          music.thumbnail,
                          music.title,
                          music.artist
                        )
                      }
                      src={music.thumbnail}
                      className="listThumbnail"
                      alt={`Thumbnail for ${music.title}`}
                      style={{
                        maxWidth: "200px",
                        minWidth: "200px",
                        maxHeight: "200px",
                        minHeight: "200px",
                        cursor: "pointer",
                      }}
                    />
                    <div className="belowThumbnail">
                      <div className="musicInfo">
                        <span className="musicTitle"> {music.title} </span>{" "}
                        <span className="musicArtist"> {music.artist} </span>
                      </div>
                      <button
                        className="addQueueButton"
                        onClick={() => handleAddToQueue(music)}
                      >
                        {/* Add to Queue button */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
  <path d="M0 8.05664C0 8.53516 0.400391 8.92578 0.869141 8.92578H7.1875V15.2441C7.1875 15.7129 7.57812 16.1133 8.05664 16.1133C8.53516 16.1133 8.93555 15.7129 8.93555 15.2441V8.92578H15.2441C15.7129 8.92578 16.1133 8.53516 16.1133 8.05664C16.1133 7.57812 15.7129 7.17773 15.2441 7.17773H8.93555V0.869141C8.93555 0.400391 8.53516 0 8.05664 0C7.57812 0 7.1875 0.400391 7.1875 0.869141V7.17773H0.869141C0.400391 7.17773 0 7.57812 0 8.05664Z" fill="black" fill-opacity="0.85"/>
</svg>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li
                  key={musicList.id}
                  onClick={() =>
                    handleThumbnailClick(
                      musicList.link,
                      musicList.thumbnail,
                      music.title,
                      music.artist
                    )
                  }
                >
                  <strong>Title:</strong> {musicList.title},{" "}
                  <strong>Artist:</strong> {musicList.artist}
                  <br />
                  <img
                    src={musicList.thumbnail}
                    alt={`Thumbnail for ${musicList.title}`}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      cursor: "pointer",
                    }}
                  />
                </li>
              )}
            </ul>
          )}
          {showOverlay && (
            <div className="overlay">
              <div className="player">
                <div className="playInfoGroup">
                  <button className="controlButton" onClick={playPreviousTrack}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="16" viewBox="0 0 30 16" fill="none">
  <g clip-path="url(#clip0_1380_617)">
    <path d="M12.0605 15.3613C12.8223 15.3613 13.4668 14.7754 13.4668 13.6914V1.68945C13.4668 0.605469 12.8223 0.0195312 12.0605 0.0195312C11.6602 0.0195312 11.3379 0.146484 10.9375 0.380859L0.986328 6.24023C0.292969 6.65039 0 7.12891 0 7.68555C0 8.25195 0.292969 8.73047 0.986328 9.14062L10.9375 15C11.3281 15.2344 11.6602 15.3613 12.0605 15.3613ZM25.4785 15.3613C26.2402 15.3613 26.8848 14.7754 26.8848 13.6914V1.68945C26.8848 0.605469 26.2402 0.0195312 25.4785 0.0195312C25.0781 0.0195312 24.7559 0.146484 24.3555 0.380859L14.4043 6.24023C13.7109 6.65039 13.418 7.12891 13.418 7.68555C13.418 8.25195 13.7109 8.73047 14.4043 9.14062L24.3555 15C24.7461 15.2344 25.0781 15.3613 25.4785 15.3613Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1380_617">
      <rect width="29.4824" height="15.3613" fill="white"/>
    </clipPath>
  </defs>
</svg>
                  </button>
                  <img
                    className="thumbnail"
                    src={selectedVideoThumbnail}
                    alt="Thumbnail for selected song"
                  />
                  <div className="playInfo">
                    <h2 className="playingTitle">{selectedVideoTitle}</h2>
                    <h2 className="playingArtist">{selectedVideoArtist} </h2>
                  </div>
                  <button className="controlButton" onClick={playNextTrack}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="16" viewBox="0 0 29 16" fill="none">
  <g clip-path="url(#clip0_1380_625)">
    <path d="M3.29102 15.3613C3.69141 15.3613 4.02344 15.2344 4.41406 15L14.3652 9.14062C15.0586 8.73047 15.3613 8.25195 15.3613 7.68555C15.3613 7.12891 15.0586 6.65039 14.3652 6.24023L4.41406 0.380859C4.01367 0.146484 3.69141 0.0195312 3.29102 0.0195312C2.5293 0.0195312 1.88477 0.605469 1.88477 1.68945V13.6914C1.88477 14.7754 2.5293 15.3613 3.29102 15.3613ZM16.709 15.3613C17.1094 15.3613 17.4414 15.2344 17.832 15L27.793 9.14062C28.4766 8.73047 28.7793 8.25195 28.7793 7.68555C28.7793 7.12891 28.4766 6.65039 27.793 6.24023L17.832 0.380859C17.4414 0.146484 17.1094 0.0195312 16.709 0.0195312C15.9473 0.0195312 15.3027 0.605469 15.3027 1.68945V13.6914C15.3027 14.7754 15.9473 15.3613 16.709 15.3613Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1380_625">
      <rect width="28.7793" height="15.3613" fill="white"/>
    </clipPath>
  </defs>
</svg>
                  </button>
                  <button className="controlButton" onClick={toggleRepeatTrack}>
                    {isRepeatTrack ? <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
  <g clip-path="url(#clip0_1380_633)">
    <path d="M19.9219 9.96094C19.9219 15.4004 15.4102 19.9219 9.96094 19.9219C4.52148 19.9219 0 15.4004 0 9.96094C0 4.51172 4.51172 0 9.95117 0C15.4004 0 19.9219 4.51172 19.9219 9.96094ZM14.9316 10.293V10.8398C14.9316 11.7871 14.2676 12.4023 13.291 12.4023H9.33594V11.1621C9.33594 10.8203 9.13086 10.6152 8.78906 10.6152C8.65234 10.6152 8.48633 10.6738 8.37891 10.7617L6.09375 12.6465C5.81055 12.8809 5.81055 13.252 6.09375 13.4863L8.37891 15.3906C8.49609 15.4883 8.65234 15.5469 8.78906 15.5469C9.13086 15.5469 9.33594 15.332 9.33594 14.9902V13.7402H13.1836C15.0586 13.7402 16.2793 12.627 16.2793 10.9082V10.293C16.2793 9.91211 15.9961 9.62891 15.6152 9.62891C15.2148 9.62891 14.9316 9.91211 14.9316 10.293ZM10.5957 4.9707V6.2207H6.74805C4.87305 6.2207 3.65234 7.33398 3.65234 9.04297V9.66797C3.65234 10.0293 3.95508 10.332 4.31641 10.332C4.70703 10.332 5 10.0293 5 9.66797V9.11133C5 8.17383 5.66406 7.55859 6.64062 7.55859H10.5957V8.79883C10.5957 9.15039 10.8105 9.35547 11.1426 9.35547C11.2793 9.35547 11.4453 9.30664 11.5625 9.20898L13.8379 7.31445C14.1211 7.08008 14.1211 6.71875 13.8379 6.48438L11.5625 4.58008C11.4453 4.48242 11.2793 4.42383 11.1426 4.42383C10.8105 4.42383 10.5957 4.63867 10.5957 4.9707Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1380_633">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_1380_642)">
    <path d="M9.96094 19.9219C15.4102 19.9219 19.9219 15.4004 19.9219 9.96094C19.9219 4.51172 15.4004 0 9.95117 0C4.51172 0 0 4.51172 0 9.96094C0 15.4004 4.52148 19.9219 9.96094 19.9219ZM9.96094 18.2617C5.35156 18.2617 1.66992 14.5703 1.66992 9.96094C1.66992 5.35156 5.3418 1.66016 9.95117 1.66016C14.5605 1.66016 18.2617 5.35156 18.2617 9.96094C18.2617 14.5703 14.5703 18.2617 9.96094 18.2617Z" fill="black" fill-opacity="0.85"/>
    <path d="M3.83789 9.07227V9.67773C3.83789 10.0293 4.13086 10.3223 4.48242 10.3223C4.85352 10.3223 5.13672 10.0293 5.13672 9.67773V9.14062C5.13672 8.23242 5.78125 7.62695 6.73828 7.62695H10.5664V8.83789C10.5664 9.16992 10.7812 9.375 11.0938 9.375C11.2305 9.375 11.377 9.31641 11.5039 9.22852L13.7109 7.39258C13.9844 7.16797 13.9844 6.81641 13.7109 6.5918L11.5039 4.74609C11.377 4.6582 11.2305 4.59961 11.0938 4.59961C10.7812 4.59961 10.5664 4.80469 10.5664 5.12695V6.33789H6.83594C5.01953 6.33789 3.83789 7.42188 3.83789 9.07227ZM16.0742 10.8789V10.2832C16.0742 9.91211 15.8008 9.63867 15.4297 9.63867C15.0488 9.63867 14.7754 9.91211 14.7754 10.2832V10.8105C14.7754 11.7285 14.1309 12.334 13.1738 12.334H9.3457V11.123C9.3457 10.8008 9.14062 10.5957 8.81836 10.5957C8.68164 10.5957 8.53516 10.6543 8.41797 10.7422L6.20117 12.5684C5.92773 12.793 5.91797 13.1641 6.20117 13.3789L8.41797 15.2246C8.53516 15.3125 8.68164 15.3711 8.81836 15.3711C9.14062 15.3711 9.3457 15.166 9.3457 14.834V13.623H13.0762C14.8926 13.623 16.0742 12.5391 16.0742 10.8789Z" fill="black" fill-opacity="0.85"/>
  </g>
  <defs>
    <clipPath id="clip0_1380_642">
      <rect width="20.2832" height="19.9316" fill="white"/>
    </clipPath>
  </defs>
</svg>}
                  </button>
                </div>
                <YouTubeAudioPlayer
                  videoId={selectedVideoId}
                  onEnd={playNextTrack}
                  isRepeat={isRepeatTrack}
                />
              </div>
              <button className="closeButton" onClick={closeOverlay}>
                close
              </button>
            </div>
          )}
          {showAddMusicOverlay && (
            <div className="overlay2">
              <div className="addMusicForm">
                <label>
                  Track Title:
                  <input
                    type="text"
                    value={newMusicData.title}
                    onChange={(e) =>
                      setNewMusicData({
                        ...newMusicData,
                        title: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Artist:
                  <input
                    type="text"
                    value={newMusicData.artist}
                    onChange={(e) =>
                      setNewMusicData({
                        ...newMusicData,
                        artist: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Year:
                  <input
                    type="text"
                    value={newMusicData.year}
                    onChange={(e) =>
                      setNewMusicData({ ...newMusicData, year: e.target.value })
                    }
                  />
                </label>
                <label>
                  Thumbnail Link:
                  <input
                    type="text"
                    value={newMusicData.thumbnail}
                    onChange={(e) =>
                      setNewMusicData({
                        ...newMusicData,
                        thumbnail: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  YouTube Link:
                  <input
                    type="text"
                    value={newMusicData.youtubeLink}
                    onChange={(e) =>
                      setNewMusicData({
                        ...newMusicData,
                        youtubeLink: e.target.value,
                      })
                    }
                  />
                </label>

                <button onClick={handleAddMusicSubmit}>Submit</button>
              </div>
              <button className="closeButton" onClick={closeOverlay}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1352_622)">
                    <path
                      d="M9.96094 19.9219C15.4102 19.9219 19.9219 15.4004 19.9219 9.96094C19.9219 4.51172 15.4004 0 9.95117 0C4.51172 0 0 4.51172 0 9.96094C0 15.4004 4.52148 19.9219 9.96094 19.9219ZM9.96094 18.2617C5.35156 18.2617 1.66992 14.5703 1.66992 9.96094C1.66992 5.35156 5.3418 1.66016 9.95117 1.66016C14.5605 1.66016 18.2617 5.35156 18.2617 9.96094C18.2617 14.5703 14.5703 18.2617 9.96094 18.2617Z"
                      fill="black"
                      fillOpacity="0.85"
                    />
                    <path
                      d="M6.62109 14.0918C6.8457 14.0918 7.04102 14.0039 7.1875 13.8477L9.95117 11.0742L12.7344 13.8477C12.8809 13.9941 13.0664 14.0918 13.291 14.0918C13.7207 14.0918 14.0723 13.7402 14.0723 13.3008C14.0723 13.0762 13.9941 12.9004 13.8379 12.7441L11.0645 9.9707L13.8477 7.17773C14.0137 7.01172 14.082 6.8457 14.082 6.63086C14.082 6.20117 13.7305 5.84961 13.3008 5.84961C13.0957 5.84961 12.9297 5.92773 12.7637 6.09375L9.95117 8.87695L7.16797 6.10352C7.02148 5.94727 6.8457 5.86914 6.62109 5.86914C6.19141 5.86914 5.83984 6.21094 5.83984 6.64062C5.83984 6.85547 5.92773 7.04102 6.07422 7.1875L8.84766 9.9707L6.07422 12.7539C5.92773 12.9004 5.83984 13.0859 5.83984 13.3008C5.83984 13.7402 6.19141 14.0918 6.62109 14.0918Z"
                      fill="black"
                      fillOpacity="0.85"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1352_622">
                      <rect width="20.2832" height="19.9316" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="rightPanel">
          <Queue queue={queue} onDeleteTrack={handleDeleteTrack}/>
        </div>
      </div>
    </>
  );
};

export default MusicList;
