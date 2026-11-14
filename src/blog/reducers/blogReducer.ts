import { ACTION_TYPES } from "../../auth/reducers/actionTypes";
import type { BlogReducerAction, BlogState } from "../types/blogReducerInterfaces";

export const blogReducer = (state: BlogState, action: BlogReducerAction): BlogState => {
  switch (action.type) {
    case ACTION_TYPES.save:
      return action.payload ?? state;

    default:
      return state;
  }
};
