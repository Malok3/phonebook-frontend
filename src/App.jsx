import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter  from './components/filter'
import PersonForm  from './components/personForm'
import Persons from './components/persons'
import Notification from './components/notification'
import personService from './services/persons'

import './index.css'


const App = () => {

  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notificationMessage, setNotification] = useState(null)
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    axios
      .get('/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  

  // Event handlers
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  // filter
  const personsToShow = persons.filter(person=> person.name.toLowerCase().includes(newSearch.toLowerCase()))

  //add new person
  const addName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };
    const opts = { runValidators: true }; //moongose options
    
    const duplicatePerson = persons.filter(
      (person) => person.name === newName
    )
    
    const personToAdd = duplicatePerson[0]
    const updatedPerson = { ...personToAdd, number: newNumber }

    if (duplicatePerson.length > 0) {
      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace the old number with a new one?`
        )
      ) {
        personService
          .update(updatedPerson.id, updatedPerson, opts)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNewName('');
            setNewNumber('');
            setSuccess(true);
            setNotification(`${returnedPerson.name} number has been updated.`);        
              setTimeout(() => {          
                  setNotification(null)        
                },5000
              )
          })
          .catch((error) => {
            console.log('error update')              
              setSuccess(false);
              setNotification(error.response.data.error);
              setTimeout(() => {
                setNotification(null);
              }, 5000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccess(true);
          setNotification(`${returnedPerson.name} was added to the phone book.`);        
            setTimeout(() => {          
                setNotification(null)        
              },5000
            )
        })
        .catch((error) => {
          setSuccess(false);
          setNotification(error.response.data.error);        
            setTimeout(() => {          
                setNotification(null)        
              },5000
            )
        });
    }
  };


  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Do you really want to delete ${personToDelete.name}?`)) {
      personService
        .removePerson(id)
        .then(() => {
          setSuccess(true)
          setNotification(`${personToDelete.name} has been deleted from phone book.`);        
          setTimeout(() => {          
              setNotification(null)        
            },5000
          )
          console.log(`${personToDelete.name} has been deleted`);
          // Filter out the deleted person from the state
          const updatedPersons = persons.filter((person) => person.id !== id);
          setPersons(updatedPersons);
         
        })
        .catch((error) => {
          const updatedPersons = persons.filter((person) => person.id !== id);
          setPersons(updatedPersons);
          setSuccess(false)
          setNotification(`${personToDelete.name} has already been removed from server.`);        
            setTimeout(() => {          
                setNotification(null)        
              },5000
            )
        });
    } else {
      console.log('Deletion canceled');
    }
  };


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newSearch={newSearch} onChangeFilter={handleSearchChange}/>
      <Notification message={notificationMessage} success={success}/>
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} onChangeName={handleNameChange} 
        newNumber={newNumber} onChangeNumber={handleNumberChange}
        persons={persons} setPersons={setPersons}
        addName={addName}
      />
     
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
