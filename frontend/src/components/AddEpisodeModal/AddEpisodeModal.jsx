import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import "./AddEpisode.css";
import { createEpisodeThunk } from "../../redux/episode";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getOneShowThunk } from "../../redux/show";

function AddEpisodeModal() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const show = useSelector(state => state.showState.showDetails);
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();

  const [episodeForm, setEpisodeForm] = useState({
          userId: user.id,
          showId: null,
          episodeTitle: '',
          episodeDesc: '',
          guestInfo: '',
          pubDate: null,
          duration: null,
          size: null,
          tags: '',
          episodeImage: '',
          explicit: false,
          published: false,
          prefix: null,
          downloads: null
  });

  episodeForm.showId = show.id;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "img_url") {
      setImageFile(file);
    } else if (e.target.name === "audio_url") {
      setAudioFile(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (imageFile) formData.append("img_url", imageFile);
    if (audioFile) formData.append("audio_url", audioFile);

    for (const key in cleanEpisodeForm) {
      if (cleanEpisodeForm[key]) {
        formData.append(key, cleanEpisodeForm[key]);
      }
    }

    const res = await dispatch(createEpisodeThunk(show.id, formData));

    if (res) {
      setLoading(false);
    }
    else {
      await dispatch(getOneShowThunk(show.id));
      setLoading(false);
      closeModal();
      navigate(`/shows/${show.id}`);
    }
  }

  function updateEpisodeForm(e, label) {
    setEpisodeForm(prev => {
      const newEpisodeForm = {...prev};
      newEpisodeForm[label] = e.target.value;
      return newEpisodeForm;
    })
  }

  return (
    <div className="add-episode-main">
      {loading && (
        <div className="spinner-overlay">
          <div className="loader"></div>
          <h2>Uploading Episode...</h2>
        </div>
      )}

      <h1>Upload an Episode</h1>
      <form className="form-add-episode" onSubmit={handleSubmit} method="post">
        <div className="add-episode-left-fields">
          <div className="add-episode-title">
            <label htmlFor="episodeTitle">Title</label>
            <input type="text" name="episodeTitle" id="episodeTitle" onChange={(e) => updateEpisodeForm(e, 'episodeTitle')} value={episodeForm.episodeTitle} placeholder="Episode Title"/>
          </div>
          <div className="add-episode-guests">
            <label htmlFor="guestInfo">Guests</label>
            <input
              type="text"
              name="guestInfo"
              id="guestInfo"
              onChange={(e) => {
                const inputValue = e.target.value;
                updateEpisodeForm({ target: { value: inputValue } }, 'guestInfo');
              }}
              onBlur={(e) => {
                const guestList = e.target.value.split(", ").map(guest => guest.trim());
                updateEpisodeForm({ target: { value: guestList } }, 'guestInfo');
              }}
              value={Array.isArray(episodeForm.guestInfo) ? episodeForm.guestInfo.join(", ") : episodeForm.guestInfo}
              placeholder="e.g., Jon Smith, Kate Johnson, etc..."
            />
          </div>
          <div className="add-episode-image">
            <label htmlFor="file-upload-image" className="custom-file-label">
              Choose Image
              <span className="upload-icon">
                <FaImage />
              </span>
            </label>
            <input
              type="file"
              id="file-upload-image"
              name="img_url"
              onChange={handleFileUpload}
              accept=".jpg, .jpeg, .png, .gif, .webp"
              className="hidden-file-input"
            />
          </div>
          <div className="add-episode-audio">
            <label htmlFor="file-upload-audio" className="custom-file-label">
              Upload Podcast
              <span className="upload-icon">
                <LuUpload />
              </span>
            </label>
            <input
              type="file"
              id="file-upload-audio"
              name="audio_url"
              onChange={handleFileUpload}
              accept=".mp3, .wav, .aac"
              className="hidden-file-input"
            />
          </div>
        </div>
        <div className="add-episode-right-fields">
          <div className="add-episode-tags">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              id="tags"
              onChange={(e) => {
                const inputValue = e.target.value;
                updateEpisodeForm({ target: { value: inputValue } }, 'tags');
              }}
              onBlur={(e) => {
                const tagList = e.target.value.split(", ").map(tag => tag.trim());
                updateEpisodeForm({ target: { value: tagList } }, 'tags');
              }}
              value={Array.isArray(episodeForm.tags) ? episodeForm.tags.join(", ") : episodeForm.tags}
              placeholder="e.g., technology, politics, current affairs, health, etc..."/>
          </div>
          <div className="add-episode-description">
            <label htmlFor="episodeDesc">Description</label>
            <textarea type="text" name="episodeDesc" id="episodeDesc" onChange={(e) => updateEpisodeForm(e, 'episodeDesc')} value={episodeForm.episodeDesc} placeholder="Description"/>
          </div>
          <button className="add-episode-btn" type="submit">Add Episode</button>
        </div>
      </form>
    </div>
  )
}

export default AddEpisodeModal;
