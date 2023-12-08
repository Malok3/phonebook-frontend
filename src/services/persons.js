import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, updatedPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.log('Failed to update person:', error);
      throw error; // Re-throw the error to propagate it further
    });
}


const removePerson = (id) =>{
    const request = axios
    .delete(`${baseUrl}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.log('fail to remove person')
    })
    return request.then(response => response.data)
}

export default { 
  getAll, create, update, removePerson
}