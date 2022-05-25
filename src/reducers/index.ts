import { Action, ActionType } from "../actions/index"

export interface MyState {
    items: any;
}
const initialState = {
    items: [],
}

export const reducer = (
    state: MyState = initialState, 
    action: Action
  ) => {
  switch(action.type){
    case ActionType.RECEIVED: {
      state.items = action.payload;
      console.log(state.items)
      return {items: action.payload};
    }
    // case "ADD": {
    //   return {...state};
    // }
    default:
      return state
  }
}