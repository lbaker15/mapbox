export enum ActionType {
    GET = 'GET',
    RECEIVED = 'RECEIVED'
}
interface getData {
    type: ActionType.GET; payload: object;
}
interface addData {
    type: ActionType.RECEIVED; payload: object;
}
export type Action = getData | addData;


export const addData = (items: object[]): Action => ({
    type: ActionType.RECEIVED,
    payload: items
})
export const getData = (items: object[]): Action => ({
    type: ActionType.GET,
    payload: items
})