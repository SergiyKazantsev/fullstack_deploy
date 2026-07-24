import {useState, useEffect} from 'react'
import personsService from './PersonsService.jsx'

const Notification = ({message, color}) => {
    if (message === null) {
        return null
    }

    let notificationStyle = {
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    notificationStyle = {...notificationStyle, color: color}

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

const Filter = ({filter, setNewFilter}) => {
    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    return (
        <div>
            <p>Filter</p>
            <input value={filter} onChange={handleFilterChange}/>
        </div>
    )
}

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, addName}) => {
    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <form onSubmit={addName}>
            <div>
                Name: <input value={newName} onChange={handleNameChange}/>
                <br/>
                Number: <input value={newNumber} onChange={handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({persons, filter, onDelete}) => {
    return (
        <>
            {persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()) || filter === '')
                .map(person => (
                    <div key={person.name} style={{display: 'flex'}}>
                        <p>{person.name} {person.number}</p>
                        <button onClick={() => onDelete(person.name)}>Delete</button>
                    </div>))}
        </>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setNewFilter] = useState('')
    const [message, setMessage] = useState(null)
    const [color, setColor] = useState(null)

    useEffect(() => {
        personsService.getAllPersons().then(newPersons => setPersons(newPersons))
    }, []);

    const addName = (event) => {
        event.preventDefault()

        const personsFiltered = persons.filter(person => person.name === newName)
        const personObject = {
            name: newName,
            number: newNumber,
            id: ''
        }

        if (personsFiltered.length > 0) {
            if (personsFiltered[0].number === newNumber) {
                alert(`${newName} or his number is already added to phonebook`)
                return
            } else if (window.confirm(`Edit ${newName}'s number?`)) {
                personsService.editPerson({...personsFiltered[0], number: newNumber}).then(
                    returnedPerson => {
                        const newPersons = persons.filter(person => person.id !== returnedPerson.id)
                        setPersons(newPersons.concat(returnedPerson))

                        setMessage(`${returnedPerson.name}'s number has been updated to ${returnedPerson.number}`)
                        setColor('green')
                        setTimeout(() => {
                            setMessage(null)
                            setColor(null)
                        }, 5000)
                    }
                ).catch(error => {
                    setMessage(`${personObject.name} was deleted from the database`)
                    setColor('red')
                    setTimeout(() => {
                        setMessage(null)
                        setColor(null)
                    }, 5000)
                })
                return
            }
        }
        personsService.createPerson(personObject).then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))

            setMessage(`Added ${returnedPerson.name}`)
            setColor('green')
            setTimeout(() => {
                setMessage(null)
                setColor(null)
            }, 5000)
        }).catch(error => {
            setMessage(`${personObject.name} was deleted from the database`)
            setColor('red')
            setTimeout(() => {
                setMessage(null)
                setColor(null)
            }, 5000)
        })

        setNewName('')
        setNewNumber('')
    }

    const onDelete = (name) => {
        const personObject = persons.find(person => person.name === name)
        if (window.confirm(`Delete ${personObject.name}?`)) {
            personsService.deletePerson(personObject).then(() => {
                setMessage(`Deleted ${personObject.name}`)
                setColor('green')
                setTimeout(() => {
                    setMessage(null)
                    setColor(null)
                }, 5000)
            }).catch(error => {
                setMessage(`${personObject.name} was deleted from the database`)
                setColor('red')
                setTimeout(() => {
                    setMessage(null)
                    setColor(null)
                }, 5000)
            })

        }
        setPersons(persons.filter(person => person.name !== name))
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} setNewFilter={setNewFilter}/>
            <h3>Add a new</h3>
            <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber}
                        setNewNumber={setNewNumber} addName={addName}/>
            <Notification message={message} color={color}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} onDelete={onDelete}/>
        </div>
    )
}

export default App