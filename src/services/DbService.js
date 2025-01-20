import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://coba-fdf30-default-rtdb.asia-southeast1.firebasedatabase.app/rotijudi',
})

const getAllSubmissions = () => {
  return apiClient.get('/submissions.json?print=pretty')
}

const getName = name => {
  return apiClient.get(`/submissions.json?orderBy="name"&equalTo="${name}"&print=pretty`)
}

const getStats = () => {
  return apiClient.get('/stats.json?print=pretty')
}

const postSubmission = (name, choice, random, won, secret) => {
  return apiClient.post('/submissions.json', {
    name,
    choice,
    random,
    won,
    secret,
    created: { '.sv': 'timestamp' }
  })
}

const patchStats = data => {
  return apiClient.patch('/stats.json', data)
}

export {
  getAllSubmissions,
  getName,
  getStats,
  postSubmission,
  patchStats,
}
