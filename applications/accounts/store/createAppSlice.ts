import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";

// `buildCreateSlice` allows us to create a slice with async thunks.
const createAppSlice = buildCreateSlice({
  creators: {asyncThunk: asyncThunkCreator},
});

export {createAppSlice};
