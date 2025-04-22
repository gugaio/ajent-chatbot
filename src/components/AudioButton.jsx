import React, { useState, useRef } from 'react';

const AudioButton = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  const togglePlayback = () => {
    console.log("Audio URL:", audioUrl);
    if (!audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  return (
    <button
      onClick={togglePlayback}
      className={`flex items-center justify-center w-10 h-10 rounded-full 
                 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
                 text-white transition-colors duration-200`}
      disabled={!audioUrl}
      title={isPlaying ? "Stop audio" : "Play audio"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <rect x="6" y="5" width="3" height="10" rx="1" />
          <rect x="11" y="5" width="3" height="10" rx="1" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default AudioButton;
