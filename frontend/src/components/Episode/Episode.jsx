/* eslint-disable react/prop-types */
import './Episode.css';
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { FaRegArrowAltCircleUp, FaRegEdit } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEpisodeThunk, updateEpisodeThunk } from '../../redux/episode';
import { getOneShowThunk } from '../../redux/show';

const Episode = ({episode, show}) => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState({});
  const [playing, setPlaying] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [previewEpisodeImageUrl, setPreviewEpisodeImageUrl] = useState(null);
  const [episodeForm, setEpisodeForm] = useState({
    userId: user?.id || null,
    showId: show.id || null,
    episodeTitle: episode.episodeTitle || '',
    episodeDesc: episode.episodeDesc || '',
    guestInfo: episode.guestInfo || '',
    pubDate: null,
    duration: null,
    size: null,
    tags: episode.tags || '',
    episodeImage: episode.episodeImage || '',
    explicit: episode.explicit || false,
    published: episode.published || false,
    prefix: episode.prefix || null,
    downloads: episode.downloads || null
  });

  const resetForm = () => {
    setEpisodeForm({
      userId: user.id,
      showId: show.id || null,
      episodeTitle: episode.episodeTitle || '',
      episodeDesc: episode.episodeDesc || '',
      guestInfo: episode.guestInfo || '',
      pubDate: null,
      duration: null,
      size: null,
      tags: episode.tags || '',
      episodeImage: episode.episodeImage || '',
      explicit: episode.explicit || false,
      published: episode.published || false,
      prefix: episode.prefix || null,
      downloads: episode.downloads || null
    })
  }

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
    if (editorOpen) {
      resetForm();
    }
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

  function updateEpisodeForm(e, label) {
    setEpisodeForm(prev => {
      const newEpisodeForm = {...prev};
      newEpisodeForm[label] = e.target.value;
      return newEpisodeForm;
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewEpisodeImageUrl(reader.result);
      }
      reader.readAsDataURL(file);

      if (e.target.name === 'img_url') {
        setImageFile(file);
        setEpisodeForm(prev => ({
          ...prev,
          episodeImage: file.name
        }))
      } else if (e.target.name === 'audio_url') {
        setAudioFile(file);
        setEpisodeForm(prev => ({
          ...prev,
          episodeUrl: file.name
        }))
      }
    }
  }

  const cleanEpisodeForm = {
    ...episodeForm,
    guestInfo: Array.isArray(episodeForm.guestInfo)
    ? episodeForm.guestInfo
    : episodeForm.guestInfo.split(", ").map(guest => guest.trim()),
    tags: Array.isArray(episodeForm.tags)
    ? episodeForm.tags
    : episodeForm.tags.split(", ").map(tag => tag.trim())
  };

  const handleUpdateEpisode = async (e) => {
    e.preventDefault();

    const scrollPosition = window.scrollY;

    setLoading(true);
    const formData = new FormData();

    if (imageFile) formData.append("img_url", imageFile);
    if (audioFile) formData.append("audio_url", audioFile);

    for (const key in cleanEpisodeForm) {
      if (cleanEpisodeForm[key]) {
        formData.append(key, cleanEpisodeForm[key]);
      }
    }
    try{
      const res = await dispatch(updateEpisodeThunk(show.id, episode.id, formData))

      if (!res || res.status !== 200) {
        console.log('res from update ep is not okfffffffffffffffffffffffffffffff', res)
        const err = await res.json();
        const backendErrors = {};
        backendErrors.message = err.message;
        setErrors(backendErrors);
        setLoading(false);
      } else {
        await dispatch(getOneShowThunk(show.id));
        setLoading(false);
        setEditorOpen(false);

        window.scrollTo(0, scrollPosition);
      }
    } catch (error) {
      setErrors({ general: 'An error occurred while updating the episode.' })
      setLoading(false);
    }

  }

  const handleDeleteEpisode = async (e, episode) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(deleteEpisodeThunk(episode));
      await dispatch(getOneShowThunk(show.id))
      setEditorOpen(false);
    } catch (error) {
      return (error)
    }
  }

  const hasGuests = guestInfo[0].length

  return (
    <div className="episode-block-container" key={episode.id}>
      {!editorOpen ? (
        <form className='episode-form' onSubmit={handleUpdateEpisode}>
          {episode.episodeImage ? (
            <img className="episode-image" src={episode.episodeImage}/>
          ) : (
            <img className="episode-image" src={show.showImage}/>
          )}
          <div className="episode-text-block">
            <div className="episode-play-guest">
              <div className="episode-play-title">
                {playing ? (
                  <button type="button" className="play-button" onClick={pauseAudio}>
                    <FaRegCirclePause />
                  </button>
                ) : (
                  <button type="button" className="play-button" onClick={playAudio}>
                    <FaRegCirclePlay />
                  </button>
                )}
                <div className="episode-title-container">
                  <div className="episode-title" style={{paddingLeft: '1rem'}}>
                    <h3>{episode.episodeTitle}</h3>
                  </div>
                  <div className="episode-count-guests" style={{paddingLeft: '1rem'}}>
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
              </div>
              {user?.id === show.userId ? (
                <div className="edit-episode-btn">
                <button className="open-editor-btn toggle-episode-editor-btn" onClick={toggleEditor}>
                  edit
                  <FaRegEdit className='edit-icon'/>
                </button>
                </div>
              ) : null }
            </div>
            <div className="episode-description desc-editor-closed">
              {episode.episodeDesc}
            </div>
          </div>
        </form>
      ) : (
        <form className='episode-form' ref={editorRef}>
        {previewEpisodeImageUrl ? (
          <div className="episode-image-upload-container">
            <label htmlFor="episode-image-upload" className="episode-image-upload-label">
              <img className="episode-image" src={previewEpisodeImageUrl}/>
              <FaRegArrowAltCircleUp className='image-update-icon'/>
            </label>
            <input
              className='hidden'
              type="file"
              id='episode-image-upload'
              name='episode-image-upload'
              onChange={handleFileUpload}
              accept='.jpg, .jpeg, .png, .gif'
            />
          </div>
        ) : (
          <div className="episode-image-upload-container">
            <label htmlFor="episode-image-upload" className="episode-image-upload-label">
              <img className="episode-image" src={episode.episodeImage || show.showImage}/>
              <FaRegArrowAltCircleUp className='image-update-icon'/>
            </label>
            <input
              className='hidden'
              type="file"
              id='episode-image-upload'
              name='image_url'
              onChange={handleFileUpload}
              accept='.jpg, .jpeg, .png, .gif'
            />
          </div>
        )}
        <div className="episode-text-block">
          <div className="episode-play-guest">
            <div className="episode-play-title">
              {playing ? (
                <button className="play-button" onClick={pauseAudio}>
                  <FaRegCirclePause />
                </button>
              ) : (
                <button className="upload-button" onClick={handleFileUpload}>
                  <label htmlFor="episode-audio-upload" className='episode-audio-upload-label'>
                    <FaRegArrowAltCircleUp />
                  </label>
                  <input
                    className='hidden'
                    type="file"
                    id='episode-audio-upload'
                    name='audio_url'
                    onChange={handleFileUpload}
                    accept='.mp3, .wav, .aac'
                  />
                </button>
              )}
              <div className="episode-title-container">
                <div className="episode-title">
                  <label htmlFor="episodeTitle"></label>
                  <input
                    type="text"
                    name="episodeTitle"
                    id="episodeTitle"
                    className='episode-title-field'
                    onChange={(e) => updateEpisodeForm(e, 'episodeTitle')}
                    value={episodeForm.episodeTitle}
                    placeholder="Title"
                    style={{ backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
                  />
                </div>
                <div className="episode-count-guests">
                  {hasGuests < 1 ? (
                    <h2 className='episode-guest-info'>Episode {getEpisodeNumber()}</h2>
                  ) : (
                    <input
                      type='text'
                      name='guestInfo'
                      id='guestInfo'
                      className='episode-guest-info-field'
                      onChange={(e) => updateEpisodeForm(e, 'guestInfo')}
                      value={episodeForm.guestInfo}
                      placeholder={episode.guestInfo}
                      style={{ backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
                    />
                  )}
                </div>
              </div>
            </div>
            {user?.id === show.userId ? (
              <div className="edit-episode-btn">
                <button className="delete-episode-btn toggle-episode-editor-btn" onClick={(e) => handleDeleteEpisode(e, episode)}>
                  delete
                </button>
                <button type='button' className="update-episode-btn toggle-episode-editor-btn" onClick={(e) => handleUpdateEpisode(e)}>
                  save
                </button>
                <button className="toggle-episode-editor-btn" onClick={(e) => {
                  e.preventDefault();
                  resetForm();
                  setEditorOpen(false);
                }}>
                  cancel
                </button>
              </div>
            ) : null }
          </div>
          <div className="episode-description desc-editor-open">
            <textarea
              type="text"
              name='episodeDesc'
              id='episode-description-field'
              className='episode-description-field'
              onChange={(e) => updateEpisodeForm(e, 'episodeDesc')}
              value={episodeForm.episodeDesc}
              placeholder={episode.episodeDesc}
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
        </div>
      </form>
      )
      }
    </div>
  )
}

export default Episode;
