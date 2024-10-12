import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CreateShowModal.css';
import { useModal } from '../../context/Modal';
import { createShowThunk } from '../../redux/show';

const CreateShowModal = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const { closeModal } = useModal();
  const [imgUrl, setImgUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState({
    userId: user.id,
    showTitle: '',
    showSubtitle: '',
    showDesc: '',
    author: '',
    showLink: null,
    category: null,
    showImage: '',
    language: '',
    explicit: false
  });

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
    const res = await dispatch(createShowThunk(showForm, form));
    if (res) {
      setErrors(res);
    } else {
      closeModal();
    }

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
        />
        <label htmlFor="author">Show Host</label>
        <input
          type="text"
          name='author'
          id='author'
          onChange={(e) => updateShowForm(e, 'author')}
          value={showForm.author}
          placeholder='Host Name'
        />
        <label>
          Select a Show Image
          <input
            type="file"
            id='file-upload'
            name='img_url'
            onChange={addImage}
            accept='.jpg, .jpeg, .png, .gif, .webp'
          />
        </label>
        <button type='submit'>Create Your Show</button>
      </form>
    </div>
    </>
  )
}

export default CreateShowModal;
