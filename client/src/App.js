import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser } from './actions/authActions'

import { Provider } from 'react-redux'
import store from './store'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

import './App.css'


// Check for token
// this is needed when dashboard is refreshed after successul login, then redux state gets empty
// so again setting up token and isAuthenticated to true
if(localStorage.jwtToken) {

  // Set auth token header off
  setAuthToken(localStorage.jwtToken)

  // Decode the token, get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken)

  // Call the action, so that it sets user isAuthenticated to true and gives user details
  store.dispatch(setCurrentUser(decoded))
}

class App extends Component {
  render() {
    return (
      <Provider store={store} >
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={ Landing }></Route>
          <div className="container">
            <Route exact path="/register" component={ Register }></Route>
            <Route exact path="/login" component={ Login }></Route>
          </div>
          <Footer />
        </div>
      </Router>
      </Provider>
    )
  }
}

export default App
