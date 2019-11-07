import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducers } from './reducers/rootReducer';

const persistConfig = {
    key: "root",
    storage: storage
}
//@ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducers);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);