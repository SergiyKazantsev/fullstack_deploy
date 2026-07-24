const express = require('express')
const morgan = require('morgan')
var logger = morgan('tiny')
const app = express()
app.use(express.json())
morgan.token('body', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    return ''
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0
    return String(Math.floor(Math.random() * 10000) + maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    response.status(201).json(newPerson)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const found = persons.find(person => person.id === id)

    if(found) {
        response.status(201).json(found)
    } else {
        return response.status(404).json({error: 'not found'})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const found = persons.find(person => person.id === id)
    console.log(found)
    if(found) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        return response.status(404).json({error: 'not found'})
    }
})


app.get('/info', (request, response) => {
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})