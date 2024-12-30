import { csrfFetch } from "./csrf";

const GET_SHOW_EPISODES = 'episodes/getShowEpisodes';
const CREATE_EPISODE = 'episodes/createEpisode';
const DELETE_EPISODE = 'episodes/deleteEpisode';

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

const deleteEpisode = (episodeId) => {
  return {
    type: DELETE_EPISODE,
    payload: episodeId
  };
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

export const updateEpisodeThunk = (episodeForm, form) => async () => {
  try {
    const episodeData = {};

    if (episodeForm.episodeTitle) episodeData.episodeTitle = episodeForm.episodeTitle;
    if (episodeForm.episodeSubtitle) episodeData.episodeSubtitle = episodeForm.episodeSubtitle;
    if (episodeForm.episodeDesc) episodeData.episodeDesc = episodeForm.episodeDesc;
    if (episodeForm.guestInfo) episodeData.guestInfo = episodeForm.guestInfo;
    if (episodeForm.tags) episodeData.tags = episodeForm.tags;

    const { img_url } = form;

    if (img_url) {
      episodeData.image = img_url
    }

    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(episodeData)
    }

    await csrfFetch(`/api/shows/`, options)
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
