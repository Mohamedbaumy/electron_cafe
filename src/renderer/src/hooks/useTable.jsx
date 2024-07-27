import { useReducer } from 'react'

const initialState = {
  page: 0,
  length: 10,
  search: ''
}
export const useTable = () => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_PAGE':
        return { ...state, page: action.payload }
      case 'SET_LENGTH':
        return { ...state, length: action.payload }
      case 'SET_SEARCH':
        return { ...state, search: action.payload }
      default:
        return state
    }
  }, initialState)
  return [state, dispatch]
}
