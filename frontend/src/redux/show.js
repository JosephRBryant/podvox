import { csrfFetch } from "./csrf";
import { setUser } from '../redux/session';

const GET_ALL_SHOWS = 'shows/getAllShows';
const GET_ONE_SHOW = 'shows/getOneShow';
const GET_USER_SHOWS = 'shows/getUserShows';
const CLEAR_SHOW_DETAILS = 'shows/clearShowDetails';
const CREATE_SHOW = 'shows/createShow';
const DELETE_SHOW = 'shows/deleteShow';
const UPDATE_SHOW = 'shows/updateShow';
const RESET_ALL_SHOWS = 'shows/resetAllShows';

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

export const clearShowDetails = () => ({
  type: CLEAR_SHOW_DETAILS
});

export const deleteShow = (showId) => {
  return {
    type: DELETE_SHOW,
    payload: showId
  };
};

export const createShow = (show) => {
  return {
    type: CREATE_SHOW,
    payload: show
  }
}

export const updateShow = (show) => {
  return {
    type: UPDATE_SHOW,
    payload: show
  }
}

export const resetAllShows = () => ({
  type: RESET_ALL_SHOWS,
});

export const getAllShowsThunk = () => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/shows');
    if (res.ok) {
      const data = await res.json();
      await dispatch(getAllShows(data))
      console.log('Fetched shows from API:', data);
    } else {
      throw res;
    }
  } catch(error) {
    return error;
  }
};

// export const getOneShowThunk = (showId) => async (dispatch) => {
//   try {
//     const res = await csrfFetch(`/api/shows/${showId}`);
//     if (res.ok) {
//       const data = await res.json();
//       await dispatch(getOneShow(data))
//     } else {
//       throw res;
//     }
//   } catch(error) {
//     return error;
//   }
// }

export const getOneShowThunk = (showId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/shows/${showId}`);
    const data = await res.json();
    await dispatch(getOneShow(data));
    // dispatch({ type: 'Shows/GET_ONE', payload: data});
    return data
  } catch(error) {
    console.error('Error fetching show:', error);
    return undefined;
  }
}

// export const getUserShowsThunk = (userId) => async (dispatch) => {
//   try {
//     const res = await csrfFetch(`/api/users/${userId}/shows`);
//     if (res.ok) {
//       const data = await res.json();
//       dispatch(getUserShows(data))
//     } else {
//       throw new Error('Failed to get User Show');
//     }
//   } catch(error) {
//     console.error('Error fetching user show: ', error)
//     return error;
//   }
// }

export const createShowThunk = (showForm, form) => async (dispatch, getState) => {
  try {
    const {
      userId,
      showTitle,
      showSubtitle,
      showDesc,
      author,
      language,
      explicit
    } = showForm;

    const { img_url } = form;
    const formData = new FormData();

    console.log('img_url in create thunk:', img_url)

    formData.append('userId', userId)
    formData.append('showTitle', showTitle)
    formData.append('showSubtitle', showSubtitle)
    formData.append('showDesc', showDesc)
    formData.append('author', author)
    formData.append('language', language)
    formData.append('explicit', explicit)

    if (img_url) {
      formData.append('image', img_url);
    }

    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData
    }
    const res = await csrfFetch('/api/shows', option)

    if (res.ok) {
      const show = await res.json();
      const state = getState();
      const currentUser = state.session.user;

      await dispatch(createShow(show));
      console.log('create show thunk after dispatch:', show)

      const updateUser = {
        ...currentUser,
        showId: show.id
      };
      dispatch(setUser(updateUser));
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

export const updateShowThunk = (showId, form) => async (dispatch) => {
  try {
    const showData = {};

    if (form.userId) showData.userId = form.userId;
    if (form.showTitle) showData.showTitle = form.showTitle;
    if (form.showSubtitle) showData.showSubtitle = form.showSubtitle;
    if (form.showDesc) showData.showDesc = form.showDesc;
    if (form.author) showData.author = form.author;
    if (form.showLink) showData.showLink = form.showLink;
    if (form.category) showData.category = form.category;
    if (form.showImage) showData.showImage = form.showImage;
    if (form.language) showData.language = form.language;
    if (form.explicit) showData.explicit = form.explicit;

    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(showData)
    }

    const res = await csrfFetch(`/api/shows/${showId}/update-show`, options)
    if (res.ok) {
      const updatedShow = await res.json();
      await dispatch(updateShow(updatedShow));
      return updatedShow;
    } else {
      const errorMessages = await res.json();
      return errorMessages;
    }
  } catch (error) {
    return { server: "Something went wrong. Please try again."}
  }
}

export const updateShowImgThunk = (showId, form, imgForm) => async (dispatch) => {
  try{
      const { showTitle, showSubtitle, showDesc, author, showLink, language, explicit } = form
      const { show_img_url } = imgForm;
      const formData = new FormData();

      console.log('showImgUrl in update img thunk:', show_img_url);

      console.log('show title from thunk', showTitle)
      formData.append('showId', showId);
      formData.append('showTitle', showTitle);
      formData.append('showSubtitle', showSubtitle);
      formData.append('showDesc', showDesc);
      formData.append('author', author);
      formData.append('showLink', showLink);
      formData.append('language', language);
      formData.append('explicit', explicit);
      formData.append("image", show_img_url);

      const option = {
          method: "PUT",
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData
      }

      const response = await csrfFetch(`/api/shows/${showId}/update-image`, option);
      if (response.ok) {
          console.log('formData from updateShowImgThunk:', Array.from(formData.entries()));
          try {
            const show = await response.json();
            dispatch(updateShow(show));
            return show;
          } catch (err) {
            console.error('Failed to parse JSON response:', err);
            return null;
          }
      } else if (response.status < 500) {
          const data = await response.json();
          if (data.errors) {
              return data
          } else {
              throw new Error('An error occured. Please try again.')
          }
      }
      return response;
  } catch(e){
    console.log('update image error', e)
      return e
  }
}

export const deleteShowThunk = (show) => async (dispatch) => {
  try {
    const options = {
      method: 'DELETE',
      header: {'Content-type': 'application/json'}
    };

    const res = await csrfFetch(`/api/shows/${show.id}`, options);

    if (res.ok) {
      const { showId } = await res.json();
      dispatch(deleteShow(showId))
      await dispatch(getAllShowsThunk());
    } else {
      throw res;
    }
  } catch (error) {
    return (error)
  }
}

// export const clearShowDetailsThunk = () => async (dispatch) => {

// }

export const clearAndRefetchAllShowsThunk = () => async (dispatch) => {
  dispatch(resetAllShows());
  await dispatch(getAllShowsThunk());
};

const initialState = {
  allShows: [],
  byId: {},
  showDetails: {}
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
    case CLEAR_SHOW_DETAILS:
      return {
        ...state,
        showDetails: {}
      };
    case CREATE_SHOW:
      newState = { ...state };
      newState.allShows = [action.payload, ...newState.allShows];
      newState.byId = {...newState.byId, [action.payload.id]: action.payload};
      newState.showDetails = action.payload;
      return newState;
    case UPDATE_SHOW:
      newState = { ...state };
      if (newState.showDetails.id === action.payload.id) {
        newState.showDetails = action.payload;
      }
      newState.byId = { ...newState.byId, [action.payload.id]: action.payload};
      if (newState.userShows[action.payload.id]) {
        newState.userShows = { ...newState.userShows, [action.payload.id]: action.payload};
      }
      return newState;
    case DELETE_SHOW:
      newState = { ...state };
      newState.allShows = newState.allShows.filter(show => show.id !== action.payload.showId);
      if (newState.userShows[action.payload]) {
        delete newState.userShows[action.payload]
      }
      delete newState.byId[action.payload];
      return newState;
    case RESET_ALL_SHOWS:
      return {
        ...state,
        allShows: [],
      };
    default:
      return state;
  }
};

export default showsReducer;
