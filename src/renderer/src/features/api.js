import axios from 'axios'

export const fetchData = async ({ queryKey }) => {
  const [url, params] = queryKey
  const response = await axios.post(url, params)
  return response.data
}

export const addItem = async (url, data) => {
  const response = await axios.post(url, data)
  return response.data
}

export const updateItem = async (url, data) => {
  const response = await axios.put(url, data)
  return response.data
}

export const deleteItem = async (url, id) => {
  const response = await axios.delete(url, { data: { id } })
  return response.data
}
