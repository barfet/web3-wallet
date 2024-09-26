import { createStore, combineReducers } from 'redux';
import { walletReducer } from '../reducers/walletReducer';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);