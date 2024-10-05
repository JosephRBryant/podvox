import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import "./AddEpisode.css";
import { createEpisodeThunk } from "../../redux/episode";
import { getUserShowsThunk } from "../../redux/show";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { singlePublicFileUpload } from "../../../../backend/awsS3";
// function AddEpisodeModal() {
//   const dispatch = useDispatch();
//   const user = useSelector(state => state.session.user);
//   const userShows = useSelector(state => state.showState.userShows);
//   const { closeModal } = useModal();
//   const [loaded, setLoaded] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [imgUrl, setImgUrl] = useState('');
//   const [showUpload, setShowUpload] = useState(true);
//   const [previewUrl, setPreviewUrl] = useState('');

//   useEffect(() => {
//     const getData = async () => {
//       if (user && user.id) {
//         await dispatch(getUserShowsThunk(user.id));
//         setLoaded(true)
//       }
//     }

//     if (!loaded) {
//       getData();
//     }
//   }, [dispatch, loaded, user])


//   const [episodeForm, setEpisodeForm] = useState({
//           userId: user.id,
//           showId: null,
//           episodeTitle: '',
//           episodeDesc: '',
//           guestInfo: '',
//           pubDate: null,
//           duration: null,
//           size: null,
//           tags: '',
//           // episodeUrl: '',
//           episodeImage: '',
//           explicit: false,
//           published: false,
//           prefix: null,
//           downloads: null
//   });

  // episodeForm.showId = userShows.id;
  function AddEpisodeModal() {
    const dispatch = useDispatch();
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
      // episodeUrl: '',
      episodeImage: '',
      explicit: false,
      published: false,
      prefix: null,
      downloads: null
    });
    const [imgFile, setImgFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMp3File(file);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!mp3File) return;

      setUploading(true);

      try {
        const fileUrl = await singlePublicFileUpload(mp3File);
        setEpisodeForm((prev) => ({
          ...prev,
          episodeImage: fileUrl,
        }));

        const result = await dispatch(createEpisodeThunk({ ...episodeForm, episodeImage: fileUrl }));
        if (result.errors) {
          setErrors(result.errors);
        } else {
          closeModal();
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setErrors({ upload: 'Error uploading file, Please try again.'});
      } finally {
        setUploading(false);
      }
    };

    const updateEpisodeForm = (e) => {
      const { name, value } = e.target;
      setEpisodeForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };


  // const addImage = async (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     console.log('reader data ', reader.result);
  //     setPreviewUrl(reader.result)
  //   }
  //   setImgUrl(file);
  //   setShowUpload(false);
  //   // updateEpisodeForm(e, 'episodeImage')
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault;
  //   const formData = new FormData();

  //   const img_url = imgUrl;
  //   const form = {img_url};
  //   // console.log('img url from ep upload', img_url, 'imgUrl', imgUrl)
  //   // console.log('prevUrl', previewUrl)
  //   // console.log('form', form)
  //   // console.log('img_url------', img_url)
  //   setEpisodeForm(prev => {
  //     const newEpForm = {...prev};
  //     newEpForm.episodeImage = previewUrl;
  //     return newEpForm;
  //   })

  //   console.log('episodeForm-----', episodeForm)
  //   const res = await dispatch(createEpisodeThunk(episodeForm));
  //   console.log(res, 'res from in add ep handlesub')

  //   if (res) {
  //     setErrors(res);
  //   }
  //   else {
  //     console.log('this handsub not working')
  //     closeModal();
  //     // Navigate(`/shows/${res.showId}`)
  //   }
  // }

  // function updateEpisodeForm(e, label) {
  //   setEpisodeForm(prev => {
  //     const newEpisodeForm = {...prev};
  //     newEpisodeForm[label] = e.target.value;
  //     return newEpisodeForm;
  //   })
  // }

  return (
    <div className="add-episode-main">
      <h1>Upload an Episode</h1>
      <form form="form-add-episode" onSubmit={handleSubmit}>
        <label htmlFor="episodeTitle">Title</label>
        <input type="text" name="episodeTitle" id="episodeTitle" onChange={updateEpisodeForm}/>
        <label htmlFor="episodeDesc">Description</label>
        <textarea type="text" name="episodeDesc" id="episodeDesc" onChange={updateEpisodeForm}/>
        <label htmlFor="guestInfo">Guests</label>
        <input type="text" name="guestInfo" id="guestInfo" onChange={updateEpisodeForm}/>
        <label htmlFor="tags">Tags</label>
        <textarea type="text" name="tags" id="tags" onChange={updateEpisodeForm}/>
        <label>Select an Episode Image
          <input
            type="file"
            id="file-upload"
            name="img_url"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png, .gif, .webp"
          />
        </label>
        <button type="submit" disabled={uploading}>Add Episode</button>
      </form>
    </div>
  )
}

export default AddEpisodeModal;
