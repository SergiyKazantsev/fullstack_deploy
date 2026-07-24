import axios from "axios";
const baseUrl = '/api/persons/'

const createPerson = (personObject) => {
    return axios.post(baseUrl, personObject)
        .then(response => response.data)
}

const getAllPersons = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
}

const deletePerson = (personObject) => {
    return axios.delete(`${baseUrl}${personObject.id}`)
        .then(response => response.data)
}

const editPerson = (personObject) => {
    return axios.put(`${baseUrl}${personObject.id}`, personObject)
        .then(response => response.data)
}

export default { createPerson, getAllPersons, deletePerson, editPerson }