import React from "react";
import "./Queue.css";

const Queue = ({ queue, onDeleteTrack }) => {
  const handleDelete = (index) => {
    onDeleteTrack(index);
  };

  return (
    <div className="queuePanel">
      <div className="queueTitle">
        <h2>Playing Next</h2>
      </div>
      <div className="queueList">
        {queue.length > 0 ? (
          <ul>
            {queue.map((music, index) => (
              <li key={index}>
                <div className="queueTrackInfoGroup">
                  <img
                    src={music.thumbnail}
                    alt={`Thumbnail for ${music.title}`}
                  />
                  <div className="queueTrackInfo">
                    <span>{music.title}</span>
                    <p>{music.artist}</p>
                  </div>
                </div>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_1384_651)">
                      <path
                        d="M6.47461 18.7793C6.09375 18.7793 5.84961 18.5547 5.83008 18.1836L5.53711 7.43164C5.52734 7.07031 5.77148 6.83594 6.16211 6.83594C6.52344 6.83594 6.77734 7.06055 6.78711 7.42188L7.09961 18.1836C7.10938 18.5449 6.85547 18.7793 6.47461 18.7793ZM9.45312 18.7793C9.07227 18.7793 8.80859 18.5449 8.80859 18.1836V7.43164C8.80859 7.07031 9.07227 6.83594 9.45312 6.83594C9.83398 6.83594 10.1074 7.07031 10.1074 7.43164V18.1836C10.1074 18.5449 9.83398 18.7793 9.45312 18.7793ZM12.4414 18.7793C12.0605 18.7793 11.8066 18.5449 11.8164 18.1836L12.1191 7.43164C12.1289 7.06055 12.3828 6.83594 12.7441 6.83594C13.1348 6.83594 13.3789 7.07031 13.3691 7.43164L13.0762 18.1836C13.0566 18.5547 12.8125 18.7793 12.4414 18.7793ZM5.16602 4.46289H6.71875V2.37305C6.71875 1.81641 7.10938 1.45508 7.69531 1.45508H11.1914C11.7773 1.45508 12.168 1.81641 12.168 2.37305V4.46289H13.7207V2.27539C13.7207 0.859375 12.8027 0 11.2988 0H7.58789C6.08398 0 5.16602 0.859375 5.16602 2.27539V4.46289ZM0.732422 5.24414H18.1836C18.584 5.24414 18.9062 4.90234 18.9062 4.50195C18.9062 4.10156 18.584 3.76953 18.1836 3.76953H0.732422C0.341797 3.76953 0 4.10156 0 4.50195C0 4.91211 0.341797 5.24414 0.732422 5.24414ZM4.98047 21.748H13.9355C15.332 21.748 16.2695 20.8398 16.3379 19.4434L17.0215 5.03906H1.88477L2.57812 19.4531C2.64648 20.8496 3.56445 21.748 4.98047 21.748Z"
                        fill="#B7B7B7"
                        fill-opacity="0.85"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1384_651">
                        <rect width="19.2676" height="23.4863" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="emptyQueueText">Add tracks to queue</p>
        )}
      </div>
    </div>
  );
};

export default Queue;
