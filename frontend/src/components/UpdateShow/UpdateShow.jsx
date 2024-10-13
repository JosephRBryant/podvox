import React, { useEffect, useRef, useState } from 'react';
import { FaRegEdit, FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import './UpdateShow.css';
import { useDispatch } from 'react-redux';
import { updateShowThunk } from '../../redux/show';

const UpdateShow = ({userShow}) => {
  const dispatch = useDispatch();

  const [imgUrl, setImgUrl] = useState(null);
  const [showUpload, setShowUpload] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(userShow.showImage);
  const [currImg, setCurrImg] = useState(userShow.showImage);
  const [updateBtns, setUpdateBtns] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState({
    showTitle: '',
    showSubtitle: '',
    showDesc: '',
    author: '',
    language: '',
    explicit: false
  })

  const editorRef = useRef();

  useEffect(() => {
    setShowForm({
      showTitle: userShow.showTitle || '',
      showSubtitle: userShow.showSubtitle || '',
      showDesc: userShow.showDesc || '',
      author: userShow.author || '',
      language: userShow.language || '',
      explicit: userShow.explicit || false,
    })
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      showTitle: showForm.showTitle || userShow.showTitle,
      showSubtitle: showForm.showSubtitle || userShow.showSubtitle,
      showDesc: showForm.showDesc || userShow.showDesc,
      author: showForm.author || userShow.author,
      language: showForm.language || userShow.language,
      explicit: showForm.explicit || userShow.explicit,
    };

    try {
      const res = await dispatch(updateShowThunk(userShow.id, payload));

      if (!res.id) {
        console.log('clickity click')
        const err = await res.json();
        const backendErrors = {};
        backendErrors.message = err.message;
        setErrors(backendErrors);
      } else {
        setEditorOpen(false);
        return res
      }
    } catch (error) {
      return error;
    }
  }

  function updateShowForm(e, label) {
    setShowForm(prev => {
      const newShowForm = { ...prev };
      newShowForm[label] = e.target.value;
      return newShowForm;
    })
  }

  const updateImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImgUrl(file);
      setShowUpload(false);
      setUpdateBtns(true);
    }
  }

  const handleExplicitChoice = (e) => {
    setShowForm({
      ...showForm,
      explicit: e.target.value === 'true'
    });
  }

  const toggleEditor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorOpen(!editorOpen)
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
  }, [editorOpen])

  const handleImgSubmit = async (e) => {
    e.preventDefault();
    const form = {};

    if (imgUrl) form.img_url = imgUrl;

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
      setCurrImg(updatedShow.showImage);
      setPreviewUrl(updatedShow.showImage);
      setUpdateBtns(false);
    }
  };

  const handleCancelImgSubmit = () => {
    setPreviewUrl(currImg);
    setImgUrl(null);
    setUpdateBtns(false);
  }

  return (
    <div className="show-info-container">
      {editorOpen ? (
        <form className="show-info-form" onSubmit={handleSubmit} ref={editorRef}>
          <div className="show-info-header">
            <h2>Show Info</h2>
            <div className="edit-show-info-btn">
              <button type='submit' className="toggle-editor-btn">
                save
              </button>
              <button className="toggle-editor-btn" onClick={toggleEditor}>
                cancel
              </button>
            </div>
          </div>
          <div className="title-field">
            <label htmlFor="showTitle" className="title-field-label">
                Title:
            </label>
            <input
              type="text"
              name="showTitle"
              id="showTitle"
              className="title-field-title"
              onChange={(e) => updateShowForm(e, 'showTitle')}
              value={showForm.showTitle}
              placeholder={userShow.showTitle}
            />
          </div>
          <div className="subtitle-field">
            <label htmlFor="showSubtitle" className="subtitle-field-label">
                Subtitle:
            </label>
            <input
              type="text"
              name="showSubtitle"
              id="showSubtitle"
              className="subtitle-field-subtitle"
              onChange={(e) => updateShowForm(e, 'showSubtitle')}
              value={showForm.showSubtitle}
              placeholder={userShow.showSubtitle}
            />
          </div>
          <div className="description-field">
            <label htmlFor='showDesc' className="description-field-label">
              Description:
            </label>
            <textarea
              type="text"
              name="showDesc"
              id='showDesc'
              className='description-field-description'
              onChange={(e) => updateShowForm(e, 'showDesc')}
              value={showForm.showDesc}
              placeholder={userShow.showDesc}
            />
          </div>
          <div className="author-field">
            <label htmlFor='author' className="author-field-label">
              Host Name:
            </label>
            <input
              type="text"
              name='author'
              id='author'
              className='author-field-author'
              onChange={(e) => updateShowForm(e, 'author')}
              value={showForm.author}
              placeholder={userShow.author}
            />
          </div>
          <div className="language-explicit-container">
            <div className="language-field">
              <label htmlFor='language' className="language-field-label">
                Language:
              </label>
              <input
                type="text"
                name='language'
                id='language'
                className='language-field-language'
                onChange={(e) => updateShowForm(e, 'language')}
                value={showForm.language}
                placeholder={JSON.stringify(userShow.language).slice(1,-1).charAt(0).toUpperCase() + JSON.stringify(userShow.language).slice(2,-1).toLowerCase()}
              />
            </div>
            <div className="explicit-field">
              <p>Explicit: </p>
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
            </div>
          </div>
        </form>
      ) : (
        <form className="show-info-form" onSubmit={handleSubmit}>

          <div className="show-info-header">
            <h2>Show Info</h2>
            <div className="edit-show-info-btn">
              edit
              <button className="toggle-editor-btn" onClick={toggleEditor}>
                <FaRegEdit className='edit-icon' />
              </button>
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
                {JSON.stringify(userShow.language).slice(1,-1).charAt(0).toUpperCase() + JSON.stringify(userShow.language).slice(2,-1).toLowerCase()}
              </div>

            </div>
            <div className="explicit-field">
              <p>Explicit: </p>
              <div className="explicit-yes-field-yes">
                {JSON.stringify(userShow.explicit) === 'false' ? (
                  <div className="explicit-no">
                    <div className="yes">Yes</div>
                    <div className="no-no">No</div>
                  </div>
                ) : (
                  <div className="explicit-yes">
                    <div className="yes-yes">Yes</div>
                    <div className="no">No</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
      <form className="show-img-field" onSubmit={handleImgSubmit}>
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
            onChange={updateImage}
            accept='.jpg, .jpeg, .png, .gif'
          />
        </div>
        <div className="show-img-field-img">
          <img src={previewUrl} alt="Show Image" />
          {updateBtns && (
            <div className="save-cancel-btns">
              <button type="submit" className="save-profile-btn"><FaCheckCircle /></button>
              <button type="button" className="cancel-profile-btn" onClick={handleCancelImgSubmit}><MdCancel /></button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateShow;
