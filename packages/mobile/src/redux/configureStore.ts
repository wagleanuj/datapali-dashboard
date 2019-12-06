import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducers } from './reducers/rootReducer';
import {AsyncStorage} from 'react-native';

export const persistConfig = {
    storage: AsyncStorage,
    key: 'root',
    serialize: true,
}

const persistedReducer = persistReducer(persistConfig, rootReducers);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
