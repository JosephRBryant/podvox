import { csrfFetch } from "./csrf";

const CREATE_EPISODE = 'episodes/createEpisode';
const GET_SHOW_EPISODES = 'episodes/getShowEpisodes';
const UPDATE_EPISODE = 'episodes/updateEpisode';
const DELETE_EPISODE = 'episodes/deleteEpisode';

const createEpisode = (episode) => {
  return {
    type: CREATE_EPISODE,
    payload: episode
  }
}

const getShowEpisodes = (episodes) => {
  return {
    type: GET_SHOW_EPISODES,
    payload: episodes
  }
}

const updateEpisode = (episode) => {
  return {
    type: UPDATE_EPISODE,
    payload: episode
  }
}

const deleteEpisode = (episodeId) => {
  return {
    type: DELETE_EPISODE,
    payload: episodeId
  };
};

export const createEpisodeThunk = (showId, formData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/shows/${showId}/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createEpisode(data));
      return null;
    } else {
      const error = await response.json();
      return error.errors;
    }
  } catch(error) {
    console.error("Error creating episode:", error);
    return { general: "An error occurred. Please try again later."};
  }
};

export const getShowEpisodesThunk = (showId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/shows/${showId}/episodes`);
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


export const updateEpisodeThunk = (showId, episodeId, formData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/shows/${showId}/episodes/${episodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });

    if (response.ok) {
      const updatedEpisode = await response.json();
      dispatch(updateEpisode(updatedEpisode));
      return response;
    } else if (response.status < 500) {
      const error = await response.json();
      return error.errors || { general: 'An error occurred while updating the episode' };
    }
    // const {
    //   episodeTitle,
    //   episodeDesc,
    //   guestInfo,
    //   duration,
    //   size,
    //   tags,
    //   explicit,
    //   published,
    //   downloads
    // } = episodeForm;


    // if (episodeForm.episodeTitle) episode.episodeTitle = episodeForm.episodeTitle;
    // if (episodeForm.episodeDesc) episode.episodeDesc = episodeForm.episodeDesc;
    // if (episodeForm.guestInfo) episode.guestInfo = episodeForm.guestInfo;
    // if (episodeForm.tags) episode.tags = episodeForm.tags;

    // const { img_url } = form;

    // if (img_url) {
    //   episode.image = img_url
    // }

    // const options = {
    //   method: 'PUT',
    //   headers: {'Content-Type': 'multipart/form-data'},
    //   body: JSON.stringify(episode)
    // }

    // const response = await csrfFetch(`/api/episodes/${episodeId}`, options);
    // if (response.ok) {
    //   try {
    //     const episode = await response.json();
    //     dispatch(updateEpisode(episode));
    //     return episodeForm;
    //   } catch (err) {
    //     console.error('Failed to parse JSON response:', err);
    //     return null
    //   }
    // } else if (response.status < 500) {
    //   const data = await response.json();
    //   if (data.errors) {
    //     return data;
    //   } else {
    //     throw new Error('An error occured. Please try again.')
    //   }
    // }
    // return response;
  } catch (error) {
    return error;
  }
}

export const deleteEpisodeThunk = (episode) => async (dispatch) => {
  try {
    const options = {
      method: 'DELETE',
      header: {'Content-type': 'application/json'}
    };

    const res = await csrfFetch(`/api/episodes/${episode.id}`, options);

    if (res.ok) {
      const { episodeId } = await res.json();
      dispatch(deleteEpisode(episodeId));
      await dispatch(getShowEpisodesThunk());
    } else {
      throw res;
    }
  } catch (error) {
    return (error)
  }
}

const initialState = {
  showEpisodes: [],
  byId: {},
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
    case UPDATE_EPISODE:
      newState = {...state};

      newState.showEpisodes = newState.showEpisodes.map(episode =>
        episode.id === action.payload.id ? action.payload : episode
      );
      newState.byId = { ...newState.byId, [action.payload.id]: action.payload};
      return newState;
    case DELETE_EPISODE:
      newState = { ...state };
      newState.showEpisodes = newState.showEpisodes.filter(episode => episode.id !== action.payload.episodeId);
      if (newState.showEpisodes[action.payload]) {
        delete newState.showEpisodes[action.payload];
      }
      delete newState.byId[action.payload];
      return newState;
    default:
      return state;
  }
}

export default episodesReducer;
