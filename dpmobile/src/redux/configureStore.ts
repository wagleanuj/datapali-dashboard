import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from './reducers/rootReducer';
import {AsyncStorage} from 'react-native';

export const persistConfig = {
    storage: AsyncStorage,
    key: 'root'
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
