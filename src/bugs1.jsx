import React from 'react'
import PropTypes from 'prop-types'
import API from './API'

	const apiURL = 'http://localhost:3001'
  //const apiURL = 'https://railsapi-kurmasz.codeanyapp.com'

function UserRow({ user, onEditClicked, onDeleteClicked }) {
  console.log('user before', user)

  if(user.thumbnail !== "tinafey.gif" && 
  user.thumbnail !== "tracymorgan.gif" && 
  user.thumbnail !== "davidbowie.jpg" &&
  user.thumbnail !== "america.jpg"){
    user.thumbnail = "noImg.jpg";
  }

  console.log(user)

  return (
    <tr>
      <td>{user.fname}</td>
      <td>{user.lname}</td>
      <td>{user.email}</td>
      <td>
          <img
          src={require(`./${user.thumbnail}`)}
          
          width="70" height="70" alt="profilePic" />
      </td>
      <td className="col-md-3 btn-toolbar">
        <button className="btn btn-success btn-sm" onClick={event => onEditClicked(user)}>
          <i className="glyphicon glyphicon-pencil"></i> Edit
          </button>
        <button className="btn btn-danger btn-sm" onClick={event => onDeleteClicked(user.id)}>
          <i className="glyphicon glyphicon-remove"></i> Delete
          </button>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  onEditClicked: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired
}

function UserIndex({ users, onEditClicked, onDeleteClicked }) {
  const fullUserList = users.map((user) => (
    <UserRow key={user.id} user={user} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
  ));
  
  return (
    <section className="userList">
      <h1>Existing Users</h1>
      <table>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
          <th>Thumbnail</th>
          <th>Actions</th>
        </tr>
        {fullUserList}
      </table>
    </section>
  );
}

UserIndex.propTypes = {
  users: PropTypes.array.isRequired,
  onEditClicked: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  formMode: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  cancelCallback: PropTypes.func.isRequired
}


function UserForm({user, updateUser, formMode, submitCallback, cancelCallback}) {

    let cancelClicked = (event) => {
        event.preventDefault();
        cancelCallback();
        }

  // The form will have two different sets of buttons:
  // * A "Create" button when creating, and
  // * An "Update" and "Cancel" button when updating.
  let renderButtons = () => {
    if (formMode === "new") {
      return (
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      );
    } else {
      return (
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="submit" className="btn btn-danger" onClick={cancelClicked}>Cancel</button>
        </div>
      );
    }
  }; // end renderButtons

  let formSubmitted = (event) => {
    // Prevent the browser from re-loading the page.
    event.preventDefault();
    submitCallback();
  };

  return (
    <div className="userForm">
      <h1>User form</h1>
      <form onSubmit={formSubmitted}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            autoComplete="given-name"
            name="fname"
            id="fname"
            placeholder="First Name"
            value={user.fname}
            onChange={event => updateUser("fname", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            className="form-control"
            autoComplete="family-name"
            name="lname"
            id="lname"
            placeholder="Last Name"
            value={user.lname}
            onChange={event => updateUser("lname", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            autoComplete="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            value={user.email}
            onChange={event => updateUser("email", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail</label>
          <input
            type="thumbnail"
            className="form-control"
            autoComplete="thumbnail"
            name="thumbnail"
            id="thumbnail"
            placeholder="'./america.jpg'"
            value={user.thumbnail}
            onChange={event => updateUser("thumbnail", event.target.value)}
          />
        </div>
        {renderButtons()}
      </form>
    </div>
  );
}

function ErrorMessage ({ message }) {
  return <div className='errorMessage'>{message}</div>
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}

function Users() {
  const [userList, setUserList] = React.useState([])
  const [loadingMessage, setLoadingMessage] = React.useState('Loading...')
  const [errorMessage, setErrorMessage] = React.useState(null)

  const [formMode, setFormMode] = React.useState('new')

  const emptyUser = { fname: '', lname: '', email: '' }
  const [currentUser, setCurrentUser] = React.useState(emptyUser)

  // Note:  The {} around API.fetchUsers are important so that the block
  // passed to useEffect returns undefined (instead of the promise generated by fetch).
  React.useEffect(() => {
    API.fetchUsers().then(data => {
      setUserList(data)
      setLoadingMessage(null)
    }).catch((message) => {
      setLoadingMessage('Unable to load users because ' + message)
    })
  }, [])

    
      let updateUser = (field, value) => {
        let newUser = { ...currentUser }
        newUser[field] = value;
        setCurrentUser(newUser);
      }

      const formSubmitted = () => {
        setErrorMessage(null)
        if (formMode === 'new') {
          API.postNewUser(currentUser).then(data => {
            console.log('Received data')
            console.log(data)
            if (data.id) {
              currentUser.id = data.id
              setUserList([...userList, currentUser])
            } else {
              console.log("New user wasn't created.")
            }
          }).catch(message => setErrorMessage(`Failed to create new user: ${message}`))
        } else {
          API.updateUser(currentUser).then(() => {
            const newUserList = [...userList]
            const userIndex = userList.findIndex((user) => user.id === currentUser.id)
    
            newUserList[userIndex] = currentUser
            setUserList(newUserList)
          }).catch(message => setErrorMessage(`Failed to update user: ${message}`))
        }
      }

      let editClicked = (user) => {
        setErrorMessage(null);
        setFormMode("update");
        setCurrentUser(user);
      }

    let cancelClicked = () => {
        setErrorMessage(null)
        setFormMode("new");
        setCurrentUser(emptyUser)
      }

      const deleteClicked = (id) => {
        API.deleteUser(id).then(() => {
          setUserList(userList.filter((item) => item.id !== id))
          cancelClicked()
        }).catch(message => setErrorMessage(`Failed to delete user: ${message}`))
      }

  const errorBlock = errorMessage ? <ErrorMessage message={errorMessage} /> : null

  return (
    <div className="users">
      {errorBlock}
      <UserForm formMode={formMode} user={currentUser} updateUser={updateUser}
        submitCallback={formSubmitted} cancelCallback={cancelClicked} />
      <div />
      {loadingMessage
        ? <p>{loadingMessage}</p>
        : <UserIndex users={userList} onEditClicked={editClicked} onDeleteClicked={deleteClicked} />
      }
    </div>
  );
}

export default Users;