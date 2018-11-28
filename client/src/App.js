import React, { Component, Fragment} from 'react';
import Axios from 'axios';
import { Route, NavLink } from 'react-router-dom';
import './App.css';
import UsersList from './components/userComponents/UsersList';
import LoginForm from './components/forms/LoginForm';
import RegisterForm from './components/forms/RegisterForm';



class App extends Component {
  constructor() {
    super();
    // this.handleInputChange = this.handleInputChange.bind(this); Don't need this since reformatting to ES6 functions 
    this.state = {
      users:[],
      username:'',
      password:'',
      department:'',
      loggedIn: false
    }
  }
  handleLogin = e => {
    e.preventDefault();
    Axios
      .post("http://localhost:4200/api/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if(response.status === 200){
          this.setState({ loggedIn: true });
          this.fetchUsers();
        }
      })
      .catch(error => console.log(error));
    this.setState({
      username: '',
      password: ''
    });
  }
  handleLogout = e => {
    e.preventDefault();
    if (this.state.loggedIn){
      Axios
      .get(`http://localhost:4200/api/logout`)
      .then(() => this.setState({ users: [], loggedIn: false }))
      .catch(err => {console.log(err)});
    } 
  }
  handleRegister = e => {
    e.preventDefault();
    Axios
      .post("http://localhost:4200/api/register", {
        username: this.state.username,
        password: this.state.password,
        department: this.state.department
      })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    this.setState({
      username: '',
      password: ''
    });
    this.props.history.push('/')
  }
  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  fetchUsers = () => {
    if (this.state.loggedIn){
      Axios
      .get(`http://localhost:4200/api/users`)
      .then(response => this.setState({ users: response.data }))
      .catch(err => {console.log(err)});
    }else{
      console.log('this crap aint mounting')
    }    
  }
  render() {
    if(!this.state.loggedIn){
      return (
        <div> 
          <Fragment>
            <NavLink to='./login' >Login</NavLink>
            <NavLink to='/register' >Register</NavLink>
          </Fragment>
          <Route path='/login' render={(props) => 
            <LoginForm 
              username={this.state.username} 
              password={this.state.password}         
              handleChange={this.handleInputChange}
              login={this.handleLogin} 
            />
          }/>
          
          <Route path='/register' render={(props) => 
            <RegisterForm 
              username={this.state.username} 
              password={this.state.password}
              department={this.state.department}         
              handleChange={this.handleInputChange}
              register={this.handleRegister}  
            />
          }/>
        </div> 
      )
    }else{
      return (
        <div className="App">
          <UsersList 
            users={this.state.users} 
            logout={this.handleLogout}
          />
          
        </div>
    )}
    
  }
}

export default App;
