//@ts-ignore
import { persistReducer, persistStore } from 'redux-persist;';
import { rootReducer } from './reducers/rootReducer';
//@ts-ignore
import storageSession from 'redux-persist/lib/storage/session';
import { createStore } from 'redux';

const persistConfig = {
    key: "root",
    storage: storageSession
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);