import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CreateShowModal.css';
import { useModal } from '../../context/Modal';
import { createShowThunk, getOneShowThunk } from '../../redux/show';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../redux/session';

const CreateShowModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  const show = useSelector(state => state.showState.showDetails);
  const { closeModal } = useModal();
  const [imgUrl, setImgUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [previewShowUrl, setPreviewShowUrl] = useState('')
  const [showForm, setShowForm] = useState({
    userId: user.id,
    showTitle: '',
    showSubtitle: '',
    showDesc: '',
    author: '',
    showLink: 'www.example.com',
    category: null,
    showImage: '',
    language: '',
    explicit: false
  });

  const addImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewShowUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImgUrl(file);
      console.log('imgUrl:', imgUrl);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const img_url = imgUrl;
    const form = {img_url};

    try {
      console.log('before create show dispatch', form);
      const res = await dispatch(createShowThunk(showForm, form));
      console.log('Res from create show dispatch', res);

      if (res && (res.errors || res.server)) {
        setErrors(res);
        console.log('error creating show', res)
      } else {
        try {
          console.log('Dispatching fetchUser with user id:', user.id);
          const userRes = await dispatch(fetchUser(user.id));
          console.log('fetchUser response:', userRes);
        } catch (error) {
          console.error('Error in fetchUser dispatch', error);
        }
        try {
          console.log('Dispatching getOneShowThunk with show id:', res.id);
          const showRes = await dispatch(getOneShowThunk(res.id));
          console.log('getoneshow response:', showRes);
        } catch (error) {
          console.error('Error in getOneShow dispatch', error);
        }
        console.log('create show submit before closeModal:', show)
        closeModal();
        navigate(`/account`);
      }

    } catch (error) {
      console.error('Error in handleSubmit for createShow:', error)
    }

  }

  const handleExplicitChoice = (e) => {
    setShowForm({
      ...showForm,
      explicit: e.target.value === 'true'
    });
  }

  function updateShowForm(e, label) {
    setShowForm(prev => {
      const newShowForm = {...prev};
      newShowForm[label] = e.target.value;
      return newShowForm;
    })
  }

  return (
    <>
    <div className="create-show-main">
      <h1>Create a Show</h1>
      <form className='form-create-show' onSubmit={handleSubmit}>
        <label htmlFor="showTitle">Show Title</label>
        <input
          type="text"
          name='showTitle'
          id='showTitle'
          onChange={(e) => updateShowForm(e, 'showTitle')}
          value={showForm.showTitle}
          placeholder='Title'
          required
        />
        <label htmlFor="showSubtitle">Show Subtitle</label>
        <input
          type="text"
          name='showSubTitle'
          id='showSubTitle'
          onChange={(e) => updateShowForm(e, 'showSubtitle')}
          value={showForm.showSubtitle}
          placeholder='Subtitle'
        />
        <label htmlFor="showDesc">About This Show</label>
        <textarea
          type="text"
          name='showDesc'
          id='showDesc'
          onChange={(e) => updateShowForm(e, 'showDesc')}
          value={showForm.showDesc}
          placeholder='Describe your show, don&#39;t be shy... really try to sell it!'
          required
        />
        <label htmlFor="author">Show Host</label>
        <input
          type="text"
          name='author'
          id='author'
          onChange={(e) => updateShowForm(e, 'author')}
          value={showForm.author}
          placeholder='Host Name'
          required
        />
        <label htmlFor="language">Language</label>
        <input
          type="text"
          name='language'
          id='language'
          onChange={(e) => updateShowForm(e, 'language')}
          value={showForm.language}
          placeholder='Language'
          required
        />
        <input
          type="radio"
          name='explicit'
          id='yes'
          className="explicit-yes-field-yes"
          value="true"
          onChange={handleExplicitChoice}
          checked={showForm.explicit === true}

        />
        <label htmlFor="yes" className="explicit-yes-field-label">
          Yes
        </label>
        <input
          type="radio"
          name='explicit'
          id='no'
          className="explicit-no-field-no"
          value="false"
          onChange={handleExplicitChoice}
          checked={showForm.explicit === false}
        />
        <label htmlFor="no" className="explicit-no-field-label">
          No
        </label>
        <label>
          Select a Show Image
          <input
            type="file"
            id='file-upload'
            name='img_url'
            onChange={addImage}
            accept='.jpg, .jpeg, .png, .gif, .webp'
            required
          />
        </label>
        {!previewShowUrl ? null : (
          <img src={previewShowUrl} alt="" />
        )}
        <button type='submit'>Create Your Show</button>
      </form>
    </div>
    </>
  )
}

export default CreateShowModal;
