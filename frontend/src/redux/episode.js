import { csrfFetch } from "./csrf";

const GET_SHOW_EPISODES = 'episodes/getShowEpisodes';
const CREATE_EPISODE = 'episodes/createEpisode';

const getShowEpisodes = (episodes) => {
  return {
    type: GET_SHOW_EPISODES,
    payload: episodes
  }
}

const createEpisode = (episode) => {
  return {
    type: CREATE_EPISODE,
    payload: episode
  }
}

export const getShowEpisodesThunk = (showId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/shows/${showId}/episodes`);
    if (res.ok) {
      const data = await res.json();
      dispatch(getShowEpisodes(data))
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }
}

export const createEpisodeThunk = (episodeForm) => async (dispatch) => {
  try {
    const {userId, showId, episodeTitle, episodeDesc, guestInfo, pubDate, duration, size, tags, episodeUrl, episodeImage, explicit, published, prefix, downloads} = episodeForm;

    const episodeData = {
      userId,
      showId,
      episodeTitle,
      episodeDesc,
      guestInfo,
      pubDate,
      duration,
      size,
      tags,
      episodeUrl,
      episodeImage,
      explicit,
      published,
      prefix,
      downloads
    }

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data'},
      body: JSON.stringify(episodeData)
    }

    const res = await csrfFetch(`/api/shows/${showId}/episodes`, options)

    if (res.ok) {
      const data = await res.json();
      await dispatch(createEpisode(data));
      return data;
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }
}

// export const updateUserThunk = (userId, form) => async (dispatch) => {
//   const { img_url } = form
//   try{

//       const formData = new FormData();

//       formData.append('userId', userId)
//       formData.append("image", img_url);

//       const option = {
//           method: "PUT",
//           headers: { 'Content-Type': 'multipart/form-data' },
//           body: formData
//       }

//       const response = await csrfFetch(`/api/users/${userId}/update`, option);
//       if (response.ok) {
//           const user = await response.json();
//           dispatch(editUser(user));

//       } else if (response.status < 500) {
//           const data = await response.json();
//           if (data.errors) {
//               return data
//           } else {
//               throw new Error('An error occured. Please try again.')
//           }
//       }
//       return response;
//   } catch(e){
//       return e
//   }
// }

const initialState = {
  showEpisodes: [],
  byId: {}
}

const episodesReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_SHOW_EPISODES:
      newState = {...state};
      newState.showEpisodes = action.payload

      for (let episode in action.payload) {
        newState.byId[episode.id] = episode
      }
      return newState;
    case CREATE_EPISODE:
      newState = {...state};
      newState.showEpisodes = [action.payload, ...newState.showEpisodes];
      newState.byId = {...newState.byId, [action.payload.id]: action.payload};
      return newState;
    default:
      return state;
  }
}

export default episodesReducer;
