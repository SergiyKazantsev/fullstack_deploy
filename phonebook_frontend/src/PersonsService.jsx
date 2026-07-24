import axios from "axios";

const createPerson = (personObject) => {
    return axios.post('http://localhost:3001/persons', personObject)
        .then(response => response.data)
}

const getAllPersons = () => {
    return axios.get('http://localhost:3001/persons')
        .then(response => response.data)
}

const deletePerson = (personObject) => {
    return axios.delete(`http://localhost:3001/persons/${personObject.id}`)
        .then(response => response.data)
}

const editPerson = (personObject) => {
    return axios.put(`http://localhost:3001/persons/${personObject.id}`, personObject)
        .then(response => response.data)
}

export default { createPerson, getAllPersons, deletePerson, editPerson }