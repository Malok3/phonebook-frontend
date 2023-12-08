import Person from './person'

const Persons = (props) => {
    const personsToShow = props.personsToShow
    return(
      <>
      <ul>
        {personsToShow.map(person=>
            <Person key={person.id} name={person.name} number={person.number} deletePerson={props.deletePerson} id={person.id}/>
        )}
      </ul> 
    </>
    )
  }

export default Persons