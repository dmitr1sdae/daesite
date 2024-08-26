import type {Action, ThunkAction} from "@reduxjs/toolkit";
import {combineSlices, configureStore} from "@reduxjs/toolkit";
import {userSlice} from "./features/user";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(userSlice);
// Infer the `RootState` type from the root reducer
type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware();
    },
  });
};

// Infer the return type of `makeStore`
type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
type AppDispatch = AppStore["dispatch"];
type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export {makeStore};
export type {RootState, AppStore, AppDispatch, AppThunk};
