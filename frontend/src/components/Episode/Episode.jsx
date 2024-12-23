/* eslint-disable react/prop-types */
import './Episode.css';
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import React, { useEffect, useState, useRef } from 'react';
let sampleAudio = new Audio("https://toginet.com/images/podvox/Sample.mp3");
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import UpdateEpisodeModal from '../UpdateEpisodeModal';

const Episode = ({episode, show}) => {
  const user = useSelector(state => state.session.user);
  const audioRef = useRef(null);
  // const podcastAudio = new Audio(episode.episodeUrl)
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (episode.episodeUrl) {
      audioRef.current = new Audio(episode.episodeUrl);
    } else {
      audioRef.current = new Audio("https://toginet.com/images/podvox/Sample.mp3");
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [episode.episodeUrl]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const guestInfo = episode.guestInfo.split(',');

  const getEpisodeNumber = () => {
    let episodes = show.Episodes
    for (let i = 0; i < episodes.length; i++) {
      if (episodes[i].id === episode.id) {
        return i + 1;
      }
    }
  }

  const hasGuests = guestInfo[0].length

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
            {hasGuests < 1 ? (
              <h2>Episode {getEpisodeNumber()}</h2>
            ) : (
              <h2>Episode {getEpisodeNumber()} with{' '}
              {guestInfo.length === 1
                ? `guest ${guestInfo[0]}`
                : `guests ${guestInfo.slice(0, -1).join(', ')}, and ${guestInfo[guestInfo.length - 1]}`}
             </h2>
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
