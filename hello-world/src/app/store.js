import { configureStore } from '@reduxjs/toolkit'
import keyReducer from '../features/keyController/keyControllerSlice'

export default configureStore({
  reducer: {
    counter: keyReducer,
  },
});
