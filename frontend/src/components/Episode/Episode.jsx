/* eslint-disable react/prop-types */
import './Episode.css';
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import React, { useState } from 'react';
let sampleAudio = new Audio("https://toginet.com/images/podvox/Sample.mp3");
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import UpdateEpisodeModal from '../UpdateEpisodeModal';

const Episode = ({episode, show}) => {
  const user = useSelector(state => state.session.user);
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
              <h2>Episode {episode.episodeNumber}  with guest {JSON.parse(episode.guestInfo)}</h2>
            ) : (
              <h2>Episode {episode.episodeNumber}</h2>
            )}
          </div>
          {user && (user.id === show.userId) ? (
            <OpenModalMenuItem
              className="edit-episode-btn"
              itemText={<FaRegEdit />}
              modalComponent={<UpdateEpisodeModal />}
              episode={episode}
            />
          ) : null }
        </div>
        <div className="episode-description">
          {episode.episodeDesc}
        </div>
      </div>
    </div>
  )
}

export default Episode;
