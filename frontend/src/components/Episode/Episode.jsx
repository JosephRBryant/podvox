/* eslint-disable react/prop-types */
import './Episode.css';
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import React, { useState } from 'react';
let sampleAudio = new Audio("https://toginet.com/images/podvox/Sample.mp3");

const Episode = ({episode, show}) => {
  const [playing, setPlaying] = useState(false);
  const playAudio = () => {
    sampleAudio.play()
    setPlaying(true)
  }

  const pauseAudio = () => {
    sampleAudio.pause()
    sampleAudio.load()
    setPlaying(false)
  }
  return (
    <div className="episode-block-container">
      {episode.episodeImage ? (
        <img className="episode-image" src={episode.episodeImage}/>
      ) : (
        <img className="episode-image" src={show.showImage}/>
      )}
      <div className="episode-text-block">
        <div className="episode-play-guest">
          {playing ? (
            <button className="play-button" onClick={pauseAudio}>
              <FaRegCirclePause />
            </button>
          ) : (
            <button className="play-button" onClick={playAudio}>
              <FaRegCirclePlay />
            </button>
          )}
          <div className="episode-title-container">
            {<h3>{episode.episodeTitle}</h3>}
            {episode.guestInfo.length > 0 ? (
              <h2>Episode {episode.id}  with guest {JSON.parse(episode.guestInfo)}</h2>
            ) : (
              <h2>Episode {episode.id}</h2>
            )}
          </div>
        </div>
        <div className="episode-description">
          {episode.episodeDesc}
        </div>
      </div>
    </div>
  )
}

export default Episode;
