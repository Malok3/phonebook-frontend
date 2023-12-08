const Person = (props) => {
  const deletePerson = props.deletePerson
    return(
      <>
        <li>{props.name} {props.number} <button onClick={() => deletePerson(props.id)}>Delete</button></li>
      </>
    )
  }

export default Person