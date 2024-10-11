import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import showsReducer from "./show";
import episodesReducer from "./episode";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['session', 'showState']
}

const rootReducer = combineReducers({
    session: sessionReducer,
    showState: showsReducer,
    episodeState: episodesReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

let enhancer;
if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

export const configureStore = (preloadedState) => {
    const store = createStore(persistedReducer, preloadedState, enhancer);
    const persistor = persistStore(store);
    return { store, persistor }
};
