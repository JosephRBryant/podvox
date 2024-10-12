import React, { useState } from 'react';
import { FaRegEdit, FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import './UpdateShow.css';
import { useDispatch } from 'react-redux';
import { updateShowThunk } from '../../redux/show';

const UpdateShow = (userShow) => {
  userShow = userShow.userShow
  const dispatch = useDispatch();
  const [showImgUrl, setShowImgUrl] = useState(null);
  const [showShowUpload, setShowShowUpload] = useState(true);
  const [showPreviewUrl, setShowPreviewUrl] = useState(userShow.showImage);
  const [currShowImg, setCurrShowImg] = useState(userShow.showImage);
  const [updateShowBtns, setUpdateShowBtns] = useState(false);

  const updateShowImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setShowPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setShowImgUrl(file);
      setShowShowUpload(false);
      setUpdateShowBtns(true);
    }
  }

  const handleShowImgSubmit = async (e) => {
    e.preventDefault();
    const form = {};

    if (showImgUrl) form.img_url = showImgUrl;

    const updatedShow = await dispatch(updateShowThunk(
      userShow.id,
      {
        userId: userShow.userId,
        showtitle: userShow.showTitle,
        showSubtitle: userShow.showSubtitle,
        showDesc: userShow.showDesc,
        author: userShow.author,
        language: userShow.language,
        explicit: userShow.explicit
      }, form));

    if (updatedShow) {
      setCurrShowImg(updatedShow.showImage);
      setShowPreviewUrl(updatedShow.showImage);
      setUpdateShowBtns(false);
    }
  };

  const handleShowCancel = () => {
    setShowPreviewUrl(currShowImg);
    setShowImgUrl(null);
    setUpdateShowBtns(false);
  }

  return (
    <div className="show-info-container">
      <div className="show-info-header">
        <h2>Show Info</h2>
        <div className="edit-show-info-btn">
          edit
          <FaRegEdit className='edit-icon' />
        </div>
      </div>
      <div className="title-field">
        <div className="title-field-label">
            Title:
        </div>
        <div className="title-field-title">
          {userShow.showTitle}
        </div>
      </div>
      <div className="subtitle-field">
        <div className="subtitle-field-label">
          Subtitle:
        </div>
        <div className="subtitle-field-subtitle">
          {userShow.showSubtitle}
        </div>
      </div>
      <div className="description-field">
        <div className="description-field-label">
          Description:
        </div>
        <div className="description-field-description">
          {userShow.showDesc}
        </div>
      </div>
      <div className="author-field">
        <div className="author-field-label">
          Host Name:
        </div>
        <div className="author-field-author">
          {userShow.author}
        </div>
      </div>
      <div className="language-explicit-container">
        <div className="language-field">
          <div className="language-field-label">
            Language:
          </div>
          <div className="language-field-language">
            {/* {userShow.language} */}
            {JSON.stringify(userShow.language).slice(1,-1).charAt(0).toUpperCase() + JSON.stringify(userShow.language).slice(2,-1).toLowerCase()}
          </div>

        </div>
        <div className="explicit-field">
          <div className="explicit-field-label">
            Explicit:
          </div>
          <div className="explicit-field-explicit">
            {JSON.stringify(userShow.explicit) === 'false' ? 'off' : 'on'}
          </div>

        </div>
      </div>
      <form className="show-img-field" onSubmit={handleShowImgSubmit}>
        <div className="show-img-field-label-btn">
          Show Image:
          <label htmlFor="show-file-upload" className="upload-img-btn">
            <FaCamera />
            Edit
          </label>
          <input
            className="hiddenShow"
            type="file"
            id='show-file-upload'
            name='img_url'
            onChange={updateShowImage}
            accept='.jpg, .jpeg, .png, .gif'
          />
        </div>
        <div className="show-img-field-img">
          <img src={showPreviewUrl} alt="Show Image" />
          {updateShowBtns && (
            <div className="save-cancel-btns">
              <button type="submit" className="save-profile-btn"><FaCheckCircle /></button>
              <button type="button" className="cancel-profile-btn" onClick={handleShowCancel}><MdCancel /></button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateShow;
