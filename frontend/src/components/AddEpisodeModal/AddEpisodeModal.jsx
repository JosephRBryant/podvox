import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import "./AddEpisode.css";
import { createEpisodeThunk } from "../../redux/episode";
import { getUserShowsThunk } from "../../redux/show";
import { useEffect, useState } from "react";
import React from "react";

function AddEpisodeModal() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const userShows = useSelector(state => state.showState.userShows);
  const { closeModal } = useModal();
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const getData = async () => {
      if (user && user.id) {
        await dispatch(getUserShowsThunk(user.id));
        setLoaded(true)
      }
    }

    if (!loaded) {
      getData();
    }
  }, [dispatch, loaded, user])


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

  episodeForm.showId = userShows.id;

  const addImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    setImgUrl(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault;
    const img_url = imgUrl;
    const form = {img_url};
    const res = await dispatch(createEpisodeThunk(episodeForm, form));

    if (res) {
      setErrors(res);
    }
    else {
      closeModal();
      // Navigate(`/shows/${res.showId}`)
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
      <h1>Upload an Episode</h1>
      <form className="form-add-episode" onSubmit={handleSubmit}>
        <label htmlFor="episodeTitle">Title</label>
        <input type="text" name="episodeTitle" id="episodeTitle" onChange={(e) => updateEpisodeForm(e, 'episodeTitle')} value={episodeForm.episodeTitle} placeholder="Title"/>
        <label htmlFor="episodeDesc">Description</label>
        <textarea type="text" name="episodeDesc" id="episodeDesc" onChange={(e) => updateEpisodeForm(e, 'episodeDesc')} value={episodeForm.episodeDesc} placeholder="Description"/>
        <label htmlFor="guestInfo">Guests</label>
        <input type="text" name="guestInfo" id="guestInfo" onChange={(e) => updateEpisodeForm(e, 'guestInfo')} value={episodeForm.guestInfo} placeholder="Guest Information"/>
        <label htmlFor="tags">Tags</label>
        <textarea type="text" name="tags" id="tags" onChange={(e) => updateEpisodeForm(e, 'tags')} value={episodeForm.tags} placeholder="Tags"/>
        <label>Select an Episode Image
          <input
            type="file"
            id="file-upload"
            name="img_url"
            onChange={addImage}
            accept=".jpg, .jpeg, .png, .gif, .webp"
          />
        </label>
        <button type="submit">Add Episode</button>
      </form>
    </div>
  )
}

export default AddEpisodeModal;
