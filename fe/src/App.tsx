import { SyntheticEvent, useEffect, useRef, useState } from "react"
import axios, { AxiosResponse } from 'axios'
import "./index.css"
import "./App.css"
// import Cookies from "js-cookie"
import Cookies from 'universal-cookie';


function App() {

  const [users, setUsers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function loginHandler(e: SyntheticEvent) {
    e.preventDefault()

    const enteredEmail = emailRef.current?.value
    const enteredPassword = passwordRef.current?.value

    const ress = await axios.post("http://localhost:8000/auth/login", {
      email: enteredEmail,
      password: enteredPassword
    }, {
      withCredentials: true,
    })
      .then(response => {
        console.log(response.data);
        
        setIsAuthenticated(true)
      })
      .catch(error => {
        console.log(error.message)
        console.log(error.response.data.message)
      })
  }

  function getUser() {
    fetch("http://localhost:8000/users/users", {
      credentials: "include",
    })
      .then((callback) => callback.json())
      .then(data => {
        console.log(data)
        setUsers(data)
      })
  }

  function logoutHandler() {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: 'include'
    })
      .then(callback => callback.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
      .finally(() => {
        setIsAuthenticated(false)
        setUsers([])
      })
  }

  return (
    <div>
      {!isAuthenticated &&
        (
          <form onSubmit={loginHandler} className="form_controls">
            <div className="form_control">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="email" ref={emailRef} />
            </div>
            <div className="form_control">
              <label htmlFor="passwordName">Password</label>
              <input type="password" placeholder="password" ref={passwordRef} />
            </div>
            <button type="submit">Submit</button>
          </form>
        )
      }
      <br /><br /><br />
      {isAuthenticated && <button onClick={getUser}>get users</button>}
      <br /><br />
      {users && users.map((user: any) => {
        return (
          <div key={user._id} style={{ display: 'flex', gap: '2rem' }}>
            <p>{user.name}</p><p>{user.email}</p>
          </div>
        )
      })}
      <br /><br />
      {isAuthenticated && <button onClick={logoutHandler}>Logout</button>}
    </div>
  )
}

export default App
