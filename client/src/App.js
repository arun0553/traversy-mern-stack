import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'

import { Provider } from 'react-redux'
import store from './store'

import PrivateRoute from './components/common/PrivateRoute'

import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'

import Posts from './components/posts/Posts'
import Post from './components/post/Post'

import AddExperience from './components/add-credentials/AddExperience'
import AddEducation from './components/add-credentials/AddEducation'

import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/edit-profile/EditProfile'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'

import './App.css'

import NotFound from './components/not-found/NotFound'


// Check for token
// this is needed when dashboard is refreshed after successul login, then redux state gets empty
// so again setting up token and isAuthenticated to true
if(localStorage.jwtToken) {

  // Set auth token header
  setAuthToken(localStorage.jwtToken)

  // Decode the token, get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken)

  // Call the action, so that it sets user isAuthenticated to true and gives user details
  store.dispatch(setCurrentUser(decoded))

  // Check for expired time
  const currentTime = Date.now() / 1000
  if(decoded.exp < currentTime) {
    // Logout User
    store.dispatch(logoutUser())

    // Clear current Profile
    store.dispatch(clearCurrentProfile())

    // Redirect to Login
    window.location.href="/login"

  }
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
              <Route exact path="/profiles" component={ Profiles }></Route>
              <Route exact path="/profile/:handle" component={ Profile }></Route>
              <Switch>
                <PrivateRoute exact path="/dashboard" component={ Dashboard }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/create-profile" component={ CreateProfile }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/edit-profile" component={ EditProfile }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-experience" component={ AddExperience }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-education" component={ AddEducation }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/feed" component={ Posts }></PrivateRoute>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={ Post }></PrivateRoute>
              </Switch>
              <Route exact path="/not-found" component={ NotFound }></Route>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
