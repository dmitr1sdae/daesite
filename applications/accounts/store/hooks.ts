// This file serves as a central hub for re-exporting pre-typed Redux hooks.
import {useDispatch, useSelector, useStore} from "react-redux";
import type {AppDispatch, AppStore, RootState} from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppStore = useStore.withTypes<AppStore>();

export {useAppDispatch, useAppSelector, useAppStore}
