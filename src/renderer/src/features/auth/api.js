import axios from 'axios'

export const login = async (data) => {
  const res = await axios.post('/auth/login', data)
  return res.data
}

export const createAfterInsertTrigger = async () => {
  const res = await axios.get('/LocalApi/createAfterInsertTrigger')
  return res
}

export const downloadImage = async (lab_id) => {
  const res = await axios.post('/LocalApi/downloadImage', { lab_id })
  return res
}
