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

export const createEpisodeThunk = (episodeForm, form) => async (dispatch) => {
  try {
    const {userId, showId, episodeTitle, episodeDesc, guestInfo, pubDate, duration, size, tags, episodeUrl, episodeImage, explicit, published, prefix, downloads} = episodeForm;
    const { img_url } = form;
    const formData = new FormData();

    formData.append('userId', userId)
    formData.append('showId', showId)
    formData.append('episodeTitle', episodeTitle)
    formData.append('episodeDesc', episodeDesc)
    formData.append('guestInfo', guestInfo)
    // formData.append('pubDate', pubDate)
    // formData.append('duration', duration)
    // formData.append('size', size)
    formData.append('tags', tags)
    // formData.append('episodeUrl', episodeUrl)
    formData.append('explicit', explicit)
    formData.append('published', published)
    // formData.append('prefix', prefix)
    // formData.append('downloads', downloads)
    formData.append('image', img_url)

    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData
    }

    const res = await csrfFetch(`/api/shows/${showId}/episodes`, option)

    if (res.ok) {
      const episode = await res.json();
      await dispatch(createEpisode(episode));
      return episode;
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data
      } else {
        throw new Error('An error occured. Please try again.')
      }
    }
  } catch(error) {
    return error;
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
    default:
      return state;
  }
}

export default episodesReducer;
