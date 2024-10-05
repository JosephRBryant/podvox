import { csrfFetch } from "./csrf";

const GET_ALL_SHOWS = 'shows/getAllShows';
const GET_ONE_SHOW = 'shows/getOneShow';
const GET_USER_SHOWS = 'shows/getUserShows';

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

const getUserShows = (shows) => {
  return {
    type: GET_USER_SHOWS,
    payload: shows
  }
};

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
      console.log('get user show thunk', data)
      await dispatch(getUserShows(data))
    } else {
      throw res
    }
  } catch(error) {
    return error;
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

      // for (let show of action.payload) {
      //   newState.byId[show.id] = show
      // }
      return newState;
    default:
      return state;
  }
};

export default showsReducer;
