import { csrfFetch } from "./csrf";

const GET_ALL_SHOWS = 'shows/getAllShows';
const GET_ONE_SHOW = 'shows/getOneShow';
const GET_USER_SHOWS = 'shows/getUserShows';
const CLEAR_USER_SHOWS = 'shows/clearUserShows';
const CREATE_SHOW = 'shows/createShow';

const getAllShows = (shows) => {
  return {
    type: GET_ALL_SHOWS,
    payload: shows
  }
};

const getOneShow = (shows) => {
  return {
    type: GET_ONE_SHOW,
    payload: shows
  }
};

export const getUserShows = (shows) => {
  return {
    type: GET_USER_SHOWS,
    payload: shows
  }
};

export const clearUserShows = () => {
  return {
    type: CLEAR_USER_SHOWS
  };
};

export const createShow = (show) => {
  return {
    type: CREATE_SHOW,
    payload: show
  }
}

export const getAllShowsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/shows');
    if (res.ok) {
      const data = await res.json();
      await dispatch(getAllShows(data))
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }
};

export const getOneShowThunk = (showId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/shows/${showId}`);
    if (res.ok) {
      const data = await res.json();
      await dispatch(getOneShow(data))
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }

}

export const getUserShowsThunk = (userId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/users/${userId}/shows`);
    if (res.ok) {
      const data = await res.json();
      console.log('fetched shows', data)
      dispatch(getUserShows(data))
    } else {
      throw res
    }
  } catch(error) {
    return error;
  }
}

export const createShowThunk = (showForm, form) => async (dispatch) => {
  try {
    const {
      userId,
      showTitle,
      showSubtitle,
      showDesc,
      author,
      showLink,
      category,
      showImage,
      language,
      explicit
    } = showForm;
    const { img_url } = form;
    const formData = new FormData();
    console.log('create show thunk', userId, showTitle, showSubtitle, showDesc, img_url)

    formData.append('userId', userId)
    formData.append('showTitle', showTitle)
    formData.append('showSubtitle', showSubtitle)
    formData.append('showDesc', showDesc)
    formData.append('author', author)
    formData.append('language', language)
    formData.append('explicit', explicit)
    formData.append('image', img_url)

    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData
    }
    console.log('formData before post fetch create show', formData)
    const res = await csrfFetch('/api/shows', option)

    if (res.ok) {
      const show = await res.json();
      await dispatch(createShow(show));
      return show;
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data
      } else {
        throw new Error('An error occured. Please try again.')
      }
    }
  } catch (error) {
    return (error)
  }
}

const initialState = {
  allShows: [],
  byId: {},
  showDetails: {},
  userShows: {}
};

const showsReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_SHOWS:
      newState = {...state};
      newState.allShows = action.payload;

      for (let show of action.payload) {
        newState.byId[show.id] = show
      }
      return newState;
    case GET_ONE_SHOW:
      newState = {...state};
      newState.showDetails = action.payload;

      for (let show in action.payload) {
        newState.byId[show.id] = show;
      }
      return newState;
    case GET_USER_SHOWS:
      newState = {...state};
      newState.userShows = action.payload;
      return newState;
    case CLEAR_USER_SHOWS:
      newState = { ...state };
      newState.userShows = {};
      return newState;
    case CREATE_SHOW:
      newState = { ...state };
      newState.allShows = [action.payload, ...newState.allShows];
      newState.byId = {...newState.byId, [action.payload.id]: action.payload};
      return newState;
    default:
      return state;
  }
};

export default showsReducer;
