import {Component} from 'react';
//import * as argon2 from "argon2-browser";
import * as bcrypt from "bcryptjs";

//const argon2 = require('argon2');

class MasterLogin extends Component {
    constructor(props) {
        super(props)
        this.state = { username: '', password: '' }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
      event.preventDefault(); // For testing purposes

      // Need Google OAuth token!

      // Check if user has used this service before
      // if yes: compare (need to store salt as well)
      // if no: generate and store both hash and salt

      // Need to make a GET request to Google getting password stuff
      // This GET request needs to be secure (SSL / TLS)
      // Decrypt / decode user manifest 
      // Compare passwords

      // Google Stuff goes here

      // Based on Google stuff, set user stuff:

      let newUser = true;
      var hash = '';
      if (newUser) {
        var salt = bcrypt.genSaltSync(10); // replace salt with salt based on username?
        hash = bcrypt.hashSync(this.state.password, salt);
        console.log("Password: " + this.state.password);
        console.log("Hash: " + hash);
        console.log("Status: " + bcrypt.compareSync(this.state.password, hash));
        // Upload doc to Google Drive
      } else {
        hash = "HI"; // Get from manifest
        bcrypt.compareSync(this.state.password, hash);
        //console.log("sjklfjsdaklf;jasdklfjdsaklfjsadlk;fjsadkl;faj");
      }
      return false;
    }

    // TODO: Render text based on new / returning

    render () {
      return <form onSubmit={this.handleSubmit}>
      <label>
        <p>Username</p>
        <input type="text" onChange = {(event) => this.setState({username:event.target.value})}/>
      </label>
      <label>
        <p>Password</p>
        <input type="password" onChange = {(event) => this.setState({password:event.target.value})}/>
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    }
  }

export default MasterLogin