import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { rootReducer } from './reducers/rootReducer';

export const persistConfig = {
    storage: AsyncStorage,
    key: 'root'
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(){
    const store = createStore(persistedReducer);
    return {
        store: store,
        persistor: persistStore(store)
    }
}