import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://coba-fdf30-default-rtdb.asia-southeast1.firebasedatabase.app/rotijudi',
})

const getName = name => {
  return apiClient.get(`/submissions.json?orderBy="name"&equalTo="${name}"&print=pretty`)
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

export { getName, postSubmission }
