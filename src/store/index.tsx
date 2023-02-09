import { combineReducers, configureStore, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSliceReducer, { resetState } from './authSlice';
import themeSlice from "./themeSlice";
import Reactotron from "../../ReactotronConfig";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const reducers = {
    authReducer: authSliceReducer,
    themeReducer: themeSlice,
};

const combinedReducer = combineReducers<RootState>(reducers as ReducersMapObject<RootState>);
const rootReducer: Reducer = (state, action) => {
    if (action.type === resetState().type) {
        state = undefined;
    }

    return combinedReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer(persistConfig, rootReducer);


// @ts-ignore: Reactotron will be defined
const enhancers = [Reactotron.createEnhancer()];

const store = configureStore({
    reducer: persistedReducer,
    enhancers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
