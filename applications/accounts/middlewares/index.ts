import {combineMiddlewares} from "@redae/nextjs-combine-middleware";
import {auth} from "./auth";
import {avatar} from "./avatar";

export const {middleware, config} = combineMiddlewares([auth, avatar]);
