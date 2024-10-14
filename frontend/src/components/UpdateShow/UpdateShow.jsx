import React, { useEffect, useRef, useState } from 'react';
import { FaRegEdit, FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import './UpdateShow.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateShowThunk, updateShowImgThunk, deleteShowThunk, getOneShowThunk } from '../../redux/show';
import { fetchUser } from '../../redux/session';

const UpdateShow = ({userId}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const show = useSelector(state => state.showState.showDetails)
  // const show = useSelector(state => state.showState.shows);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // useEffect(() => {
  //   if (userId && !isUserLoaded) {
  //     dispatch(getshowsThunk(userId));
  //     setIsUserLoaded(true)
  //   }
  // }, [dispatch, userId, isUserLoaded])
  useEffect(() => {
    dispatch(getOneShowThunk(user.showId))
  },[])

  const [showImgUrl, setShowImgUrl] = useState(null);
  const [showUpload, setShowUpload] = useState(true);
  const [previewShowUrl, setPreviewShowUrl] = useState(show.showImage);
  const [currShowImg, setCurrShowImg] = useState(show.showImage);
  const [updateBtns, setUpdateBtns] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState({
    showTitle: '',
    showSubtitle: '',
    showDesc: '',
    author: '',
    showLink: 'www.example.com',
    category: '',
    language: '',
    explicit: false
  })

  const editorRef = useRef();

  useEffect(() => {
    if (show) {
      setShowForm({
        showTitle: show.showTitle || '',
        showSubtitle: show.showSubtitle || '',
        showDesc: show.showDesc || '',
        author: show.author || '',
        showLink: 'www.example.com',
        category: show.category || '',
        language: show.language || '',
        explicit: show.explicit || false,
      });
    }
  },[show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      showTitle: showForm.showTitle || show.showTitle,
      showSubtitle: showForm.showSubtitle || show.showSubtitle,
      showDesc: showForm.showDesc || show.showDesc,
      author: showForm.author || show.author,
      showLink: 'www.example.com',
      category: showForm.category || show.category,
      language: showForm.language || show.language,
      explicit: showForm.explicit || show.explicit,
    };

    try {
      const res = await dispatch(updateShowThunk(show.id, payload));

      if (!res.id) {
        const err = await res.json();
        const backendErrors = {};
        backendErrors.message = err.message;
        setErrors(backendErrors);
      } else {
        setEditorOpen(false);
        return res;
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

  const updateShowImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewShowUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setShowImgUrl(file);
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

  const handleShowImgSubmit = async (e) => {
    e.preventDefault();
    if (!showImgUrl) return;

    const form = {
      show_img_url: showImgUrl,
      userId: show.userId,
      showTitle: show.showTitle,
      showSubtitle: show.showSubtitle,
      showDesc: show.showDesc,
      author: show.author,
      showLink: 'www.example.com',
      category: show.category,
      language: show.language,
      explicit: show.explicit
    };

    const updatedShow = await dispatch(updateShowImgThunk(show.id, form));

    if (updatedShow) {
      console.log('is the updatedShow response ok', updatedShow)
      setCurrShowImg(updatedShow.showImage);
      setUpdateBtns(false);
    }
  };

  const handleCancelShowImgSubmit = () => {
    setPreviewShowUrl(currShowImg);
    setShowImgUrl(null);
    setUpdateBtns(false);
  }

  const handleDeleteShow = async (e, show) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(deleteShowThunk(show));
      await dispatch(fetchUser(user.id));
      setEditorOpen(false);
    } catch (error) {
      return (error)
    }
  }

  return (
    <div className="show-info-container">
      {editorOpen ? (
        <form className="show-info-form" onSubmit={handleSubmit} ref={editorRef}>
          <div className="show-info-header">
            <h2>Show Info</h2>
            <div className="edit-show-info-btn">
              <button className="delete-show-btn" onClick={(e) => handleDeleteShow(e, show)}>
                delete
              </button>
              <button type='submit' className="update-show-btn">
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
              placeholder={show.showTitle}
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
              placeholder={show.showSubtitle}
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
              placeholder={show.showDesc}
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
              placeholder={show.author}
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
                placeholder={JSON.stringify(show.language).slice(1,-1).charAt(0).toUpperCase() + JSON.stringify(show.language).slice(2,-1).toLowerCase()}
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
              {show.showTitle}
            </div>
          </div>
          <div className="subtitle-field">
            <div className="subtitle-field-label">
              Subtitle:
            </div>
            <div className="subtitle-field-subtitle">
              {show.showSubtitle}
            </div>
          </div>
          <div className="description-field">
            <div className="description-field-label">
              Description:
            </div>
            <div className="description-field-description">
              {show.showDesc}
            </div>
          </div>
          <div className="author-field">
            <div className="author-field-label">
              Host Name:
            </div>
            <div className="author-field-author">
              {show.author}
            </div>
          </div>
          <div className="language-explicit-container">
            <div className="language-field">
              <div className="language-field-label">
                Language:
              </div>
              <div className="language-field-language">
                {JSON.stringify(show.language).slice(1,-1).charAt(0).toUpperCase() + JSON.stringify(show.language).slice(2,-1).toLowerCase()}
              </div>

            </div>
            <div className="explicit-field">
              <p>Explicit: </p>
              <div className="explicit-yes-field-yes">
                {/* {JSON.stringify(show.explicit) === 'false' ? (
                  <div className="explicit-no">
                    <div className="yes">Yes</div>
                    <div className="no-no">No</div>
                  </div>
                ) : (
                  <div className="explicit-yes">
                    <div className="yes-yes">Yes</div>
                    <div className="no">No</div>
                  </div>
                )} */}

              <input
                type="radio"
                name='explicit'
                id='yes'
                className="explicit-yes-field-yes"
                value="false"
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
                value="true"
                onChange={handleExplicitChoice}
                checked={showForm.explicit === false}
              />
              <label htmlFor="no" className="explicit-no-field-label">
                No
              </label>

              </div>
            </div>
          </div>
        </form>
      )}
      <form className="show-img-field" onSubmit={handleShowImgSubmit}>
        <div className="show-img-field-label-btn">
          Show Image:
          <label htmlFor="show-file-upload" className="upload-img-btn">
            <FaCamera />
            Edit
          </label>
          <input
            className="hidden"
            type="file"
            id='show-file-upload'
            name='show_img_url'
            onChange={updateShowImage}
            accept='.jpg, .jpeg, .png, .gif'
          />
        </div>
        <div className="show-img-field-img">
          <img src={previewShowUrl} alt="Show Image" />
          {updateBtns && (
            <div className="save-cancel-btns">
              <button type="submit" className="save-profile-btn"><FaCheckCircle /></button>
              <button type="button" className="cancel-profile-btn" onClick={handleCancelShowImgSubmit}><MdCancel /></button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateShow;
