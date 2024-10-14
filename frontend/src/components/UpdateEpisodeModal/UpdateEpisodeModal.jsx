import { useDispatch } from 'react-redux';
import './UpdateEpisodeModal.css';

const UpdateEpisodeModal = ({episode}) => {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState('');

  const [episodeForm, setEpisodeForm] = useState({
          episodeTitle: '',
          episodeDesc: '',
          guestInfo: '',
          tags: '',
          episodeImage: ''
  })

  const addImage = async (e) =>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    setImgUrl(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const img_url = imgUrl;
    const form = {img_url};
    const res = await dispatch()
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

export default UpdateEpisodeModal;
