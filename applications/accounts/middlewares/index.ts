import {combineMiddlewares} from "@redae/nextjs-combine-middleware";
import {auth} from "./auth";

export const {middleware, config} = combineMiddlewares([auth]);
