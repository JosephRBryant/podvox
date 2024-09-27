import React, { useState } from 'react';
import { updateUserThunk } from '../../redux/session';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../Search';
import Featured from '../Featured';
import "./Splash.css";

const Splash = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)

  //image url to send to aws
  const [imgUrl, setImgUrl] = useState("");
  //telling us if we should show the image
  const [showUpload, setShowUpload] = useState(true);
  //img url we will load in react
  const [previewUrl, setPreviewUrl] = useState("");



  //function to get image from local

  const updateImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setPreviewUrl(reader.result);
    }
    setImgUrl(file);
    setShowUpload(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const img_url = imgUrl;
    const form = {img_url};
    const updateUser = await dispatch(updateUserThunk(user.id, form))
  }



  return (
    <main>
        <div className="hero-container">
          <div className="hero-gradient">
            <div className="hero-text">
              <h1 className='header'>Your Voice, Amplified</h1>
              <h2>create . upload . stream . podcast</h2>
            </div>
            <div className="hero-buttons">
              <button className="learn-more">
                Learn more
              </button>
              <button className="sign-up">
                Host your own show
              </button>
            </div>
          </div>
        </div>
        <div className='search-container'>
          <Search />
          or
          <button className='upload'>Upload a podcast</button>
        </div>
        <h2 className='featured-header'>
          Check out our featured list of Pod Vox podcasts
        </h2>
        <Featured />
        <button className="browse">
          Browse Popular Podcasts
        </button>
        {/* <form onSubmit={handleSubmit}>
          <div>
            {showUpload && (
              <label htmlFor='file-upload'> Select From Computer
                <input
                  type='file'
                  id='file-upload'
                  name="img_url"
                  onChange={updateImage}
                  accept='.jpg, .jpeg, .png, .gif'
                  />
                </label>
            )}
            {!showUpload && (
              <div>
                <img
                  src={previewUrl}
                  alt="preview"
                />
                <button>Change Profile</button>
              </div>
            )}
          </div>
        </form> */}
    </main>
  );
}

export default Splash;
