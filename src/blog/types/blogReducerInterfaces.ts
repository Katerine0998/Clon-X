export type ActionTypes = "save";

export interface BlogState {
  title: string;
}

export interface BlogReducerAction {
  type: ActionTypes;
  payload?: BlogState;
}


