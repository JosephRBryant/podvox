import React, { useState } from 'react';
import { FaRegEdit, FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import './UpdateAccount.css';
import { useDispatch } from 'react-redux';
import { updateUserThunk } from '../../redux/session';



const UpdateAccount = (user) => {
  user = user.user;
  const dispatch = useDispatch();

  const [imgUrl, setImgUrl] = useState(null);
  const [accountUpload, setAccountUpload] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(user.profileImg);
  const [currImg, setCurrImg] = useState(user.profileImg);
  const [updateBtns, setUpdateBtns] = useState(false);

  const updateImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImgUrl(file);
      setAccountUpload(false);
      setUpdateBtns(true);
    }
  }

  const handleImgSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) return;
    
    const form = { img_url: imgUrl };
    const updatedUser = await dispatch(updateUserThunk(user.id, form));

    if (updatedUser) {
      setCurrImg(updatedUser.profileImg);
      setUpdateBtns(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(currImg);
    setImgUrl(null);
    setUpdateBtns(false);
  }

  return (
    <div className="account-info-container">
          <div className="account-info-header">
            <h2>Account Info</h2>
            <div className="edit-account-info-btn">
              edit
              <FaRegEdit className='edit-icon' />
            </div>
          </div>
          <div className="username-field">
            <div className="username-field-label">
              Username:
            </div>
            <div className="username-field-username">
              {user.username}
            </div>
          </div>
          <div className="email-field">
            <div className="email-field-label">
              Email:
            </div>
            <div className="email-field-email">
              {user.email}
            </div>
          </div>
          <div className="password-field">
            <div className="password-field-label">
              Password:
            </div>
            <div className="password-field-password">
              ******
            </div>
          </div>
          <div className="confirm-password-field">
            <div className="confirm-password-field-label">
              Confirm Password:
            </div>
            <div className="confirm-password-field-password">
              ******
            </div>
          </div>
          <form className="profile-img-field" onSubmit={handleImgSubmit}>
            <div className="profile-img-field-label-btn">
              Profile Image:
              <label htmlFor='file-upload' className="upload-img-btn">
                <FaCamera />
                Edit
              </label>
              <input
                className='hidden'
                type='file'
                id='file-upload'
                name="img_url"
                onChange={updateImage}
                accept='.jpg, .jpeg, .png, .gif'
                />
            </div>

            <div className="profile-img-field-img">
              <img src={previewUrl} alt="Profile Image"/>
              {updateBtns && (
                <div className="save-cancel-btns">
                  <button type="submit" className="save-profile-btn"><FaCheckCircle /></button>
                  <button type="button" className="cancel-profile-btn" onClick={handleCancel}><MdCancel /></button>
                </div>
              )}
            </div>
          </form>
        </div>
  )
}

export default UpdateAccount;
