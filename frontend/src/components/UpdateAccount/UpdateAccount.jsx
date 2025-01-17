import { useEffect, useState, useRef } from 'react';
import { FaRegEdit, FaCamera, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import './UpdateAccount.css';
import { useDispatch } from 'react-redux';
import { updateUserImgThunk, updateUserThunk } from '../../redux/session';

const UpdateAccount = ({user}) => {
  const dispatch = useDispatch();

  const [imgUrl, setImgUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profileImg);
  const [currImg, setCurrImg] = useState(user.profileImg);
  const [updateBtns, setUpdateBtns] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [accountForm, setAccountForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    profileImg: ''
  })
  const ulRef = useRef();

  useEffect(() => {
    setAccountForm({
      email: user.email || '',
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: user.password || '',
    })
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      email: accountForm.email || user.email,
      username: accountForm.username || user.username,
      firstName: accountForm.firstName || user.firstName,
      lastName: accountForm.lastName || user.lastName,
    };

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setErrors({ password: 'Passwords do not match' });
        return;
      } else {
        payload.password = password;
      }
    }

    try {
      const res = await dispatch(updateUserThunk(user.id, payload));

      if (!res.id || !passwordMatch) {
        const err = await res.json();
        const backendErrors = {};
        backendErrors.message = err.message;
        setErrors(backendErrors);
      } else {
        setEditorOpen(false);
        return res
      }
    } catch(error) {
      return errors;
    }
  }

  function updateAccountForm(e, label) {
    setAccountForm(prev => {
      const newAccountForm = { ...prev };
      newAccountForm[label] = e.target.value;
      return newAccountForm;
    })
  }

  const matchPassword = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(confirmPwd === password);
  };

  const updateImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImgUrl(file);
      setUpdateBtns(true);
    }
  }

  const toggleEditor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorOpen(!editorOpen)
  }

  useEffect(() => {
    if (!editorOpen) return;

    const closeEditor = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setEditorOpen(false);
      }
    };

    document.addEventListener('click', closeEditor);

    return () => document.removeEventListener('click', closeEditor);
  }, [editorOpen])

  const handleImgSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) return;

    const form = {
        img_url: imgUrl,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
     };
    const updatedUser = await dispatch(updateUserImgThunk(user.id, form));

    if (updatedUser) {
      setCurrImg(updatedUser.profileImg);
      setUpdateBtns(false);
    }
  };

  const handleCancelImgSubmit = () => {
    setPreviewUrl(currImg);
    setImgUrl(null);
    setUpdateBtns(false);
  }

  return (
    <div className="account-info-container">
      {editorOpen ? (
        <form className='account-info-form' onSubmit={handleSubmit}>
          <div className="account-info-header">
            <h2>Account Info</h2>
            <div className="edit-account-info-btn" >
              <button type='submit' className='toggle-editor-btn' disabled={!passwordMatch}>
                save
              </button>
              <button className='toggle-editor-btn' onClick={toggleEditor}>
                cancel
              </button>
            </div>
          </div>
          <div className="username-field">
            <label htmlFor="username" className="username-field-label">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id='username'
              className="username-field-username"
              onChange={(e) => updateAccountForm(e, 'username')}
              value={accountForm.username}
              placeholder={user.username}
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
          <div className="firstname-field">
            <label htmlFor="firstname" className="firstname-field-label">
              First Name:
            </label>
            <input
              type='text'
              name='firstname'
              id='firstname'
              className="firstname-field-firstname"
              onChange={(e) => updateAccountForm(e, 'firstName')}
              value={accountForm.firstName}
              placeholder={user.firstName}
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
          <div className="lastname-field">
            <label htmlFor="lastname" className="lastname-field-label">
              Last Name:
            </label>
            <input
              type='text'
              name='lastname'
              id='lastname'
              className="lastname-field-lastname"
              onChange={(e) => updateAccountForm(e, 'lastName')}
              value={accountForm.lastName}
              placeholder={user.lastName}
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
          <div className="email-field">
            <label htmlFor="email" className="email-field-label">
              Email:
            </label>
            <input
              type='email'
              name='email'
              id='email'
              className="email-field-email"
              onChange={(e) => updateAccountForm(e, 'email')}
              value={accountForm.email}
              placeholder={user.email}
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
          <div className="password-field">
            <label htmlFor="password" className="password-field-label">
              Password:
            </label>
            <input
              type='password'
              name='password'
              id='password'
              className="password-field-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='**********'
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
          </div>
          <div className="confirm-password-field">
            <label htmlFor="confirm-password" className="confirm-password-field-label">
              Confirm Password:
            </label>
            <input
              type='password'
              name='confirm-password'
              id='confirm-password'
              className="confirm-password-field-password"
              onChange={matchPassword}
              value={confirmPassword}
              placeholder='**********'
              style={{backgroundColor: '#f7f7f7', outline: '1px solid #B1B1B1'}}
            />
            {!passwordMatch && <p className='error-message'>Passwords do not match.</p>}
          </div>
        </form>
      ) : (
      <form>
        <div className="account-info-header">
          <h2>Account Info</h2>
          <div className="edit-account-info-btn" >
              edit
              <button className='toggle-editor-btn' onClick={toggleEditor}>
                <FaRegEdit className='edit-icon'/>
              </button>
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
        <div className="firstname-field">
          <div className="firstname-field-label">
            First Name:
          </div>
          <div className="firstname-field-firstname">
            {user.firstName}
          </div>
        </div>
        <div className="lastname-field">
          <div className="lastname-field-label">
            Last Name:
          </div>
          <div className="lastname-field-lastname">
            {user.lastName}
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
      </form>
      )}
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
          <img src={previewUrl || 'https://placehold.co/500x500/2196F3/fff/?font=raleway&text=image'} alt="Profile Image"/>
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

export default UpdateAccount;
