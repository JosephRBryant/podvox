import { csrfFetch } from "./csrf";

const GET_ALL_SHOWS = 'shows/getAllShows';

const getAllShows = (shows) => {
  return {
    type: GET_ALL_SHOWS,
    payload: shows
  }
}

export const getAllShowsThunk = () => async (dispatch) => {
  try {
    console.log('outer get shows thunk')
    const res = await csrfFetch('/api/shows');
    if (res.ok) {
      const data = await res.json();
      await dispatch(getAllShows(data))
      console.log('get all shows thunk data', data)
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }
}

const initialState = {
  allShows: [],
  byId: {}
}

const showsReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_SHOWS:
      newState = {...state};
      newState.allShows = action.payload;
      console.log(newState.allShows)


      for (let show of action.payload) {
        newState.byId[show.id] = show
      }
      return newState;
    default:
      return state;
  }
}

export default showsReducer;
