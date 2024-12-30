/* eslint-disable react/prop-types */
import './Episode.css';
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEpisodeThunk } from '../../redux/episode';
import { getOneShowThunk } from '../../redux/show';

const Episode = ({episode, show}) => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [playing, setPlaying] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

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

  const editorRef = useRef();

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

  const toggleEditor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorOpen(!editorOpen);
  }

  useEffect(() => {
    if (!editorOpen) return;

    const closeEditor = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) {
        setEditorOpen(false);
      }
    };

    document.addEventListener('click', closeEditor);

    return () => document.removeEventListener('click', closeEditor);
  }, [editorOpen]);

  const guestInfo = episode.guestInfo.split(',');

  const getEpisodeNumber = () => {
    let episodes = show.Episodes
    for (let i = 0; i < episodes.length; i++) {
      if (episodes[i].id === episode.id) {
        return i + 1;
      }
    }
  }

  const handleDeleteEpisode = async (e, episode) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(deleteEpisodeThunk(episode));
      await dispatch(getOneShowThunk(show.id))
      // await dispatch(getShowEpisodesThunk(show.id));
      setEditorOpen(false);
    } catch (error) {
      return (error)
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
          <div className="episode-play-title">
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
          </div>
          {user?.id === show.userId ? (
            !editorOpen ? (
              <div className="edit-episode-btn">
               <button className="open-editor-btn toggle-episode-editor-btn" onClick={toggleEditor}>
                edit
                <FaRegEdit className='edit-icon'/>
               </button>
              </div>
            ) : (
              <div className="edit-episode-btn">
                <button className="delete-episode-btn toggle-episode-editor-btn" onClick={(e) => handleDeleteEpisode(e, episode)}>
                  delete
                </button>
                <button type='submit' className="update-episode-btn toggle-episode-editor-btn">
                  (in development) save
                </button>
                <button type='submit' className="toggle-episode-editor-btn" onClick={toggleEditor}>
                  cancel
                </button>
              </div>
            )
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
