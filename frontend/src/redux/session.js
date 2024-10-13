import { csrfFetch } from './csrf';
import { getUserShowsThunk, clearUserShows } from './show';

//Constants
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const EDIT_USER = 'session/editUser';

const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const removeUser = () => ({
    type: REMOVE_USER
});

const editUser = (user) => ({
    type: EDIT_USER,
    payload: user
});

export const thunkAuthenticate = () => async (dispatch) => {
    try{
        const response = await csrfFetch("/api/restore-user");
        if (response.ok) {
            const user = await response.json();
            dispatch(setUser(user));
            dispatch(getUserShowsThunk(user.id))
        }
    } catch (e){
        return e
    }
};

export const thunkLogin = (credentials) => async dispatch => {
    const {email, password} = credentials
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({credential: email, password})
    });

    if (response.ok) {
        const user = await response.json();
        dispatch(setUser(user));
        dispatch(getUserShowsThunk(user.id));
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};

export const thunkSignup = (user) => async (dispatch) => {
    const response = await csrfFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};

export const updateUserThunk = (userId, form) => async (dispatch) => {
    try {
        const accountData = {};

        if (form.email) accountData.email = form.email;
        if (form.username) accountData.username = form.username;
        if (form.firstName) accountData.firstName = form.firstName;
        if (form.lastName) accountData.lastName = form.lastName;
        if (form.password) accountData.password = form.password;
        if (form.profileImg) accountData.profileImg = form.profileImg;

        const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(accountData)
        }

        const res = await csrfFetch(`/api/users/${userId}/update`, options);
        if (res.ok) {
            const updatedUser = await res.json();
            await dispatch(editUser(updatedUser));
            return updatedUser;
        } else {
            const errorMessages = await res.json();
            return errorMessages;
        }
    } catch (error) {
        console.error('Error updating user: ', error);
        return { server: "Something went wrong. Please try again." };
    }
}

export const updateUserImgThunk = (userId, form) => async (dispatch) => {
    const { img_url } = form
    try{

        const formData = new FormData();

        formData.append('userId', userId)
        formData.append("image", img_url);

        const option = {
            method: "PUT",
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        }

        const response = await csrfFetch(`/api/users/${userId}/update`, option);
        if (response.ok) {
            const user = await response.json();
            dispatch(editUser(user));
            return user;
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
        return e
    }
}

export const thunkLogout = () => async (dispatch) => {
    await csrfFetch("/api/session", {
        method: "DELETE",
    });
    dispatch(removeUser());
    dispatch(clearUserShows());
};


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        case EDIT_USER:
            return { ...state, user: action.payload}
        default:
            return state;
    }
}

export default sessionReducer;
