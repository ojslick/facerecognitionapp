import React, { Component } from 'react';
import Particles from '../node_modules/react-particles-js';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'f8905b19be234941bce16bc522dccf3a'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 100,
    },
    size: {
      value: 2
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        }
      }
    }
  },
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        entries: 0,
        joined: new Date()
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      entries: 0,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifiaFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifiaFace.left_col * width,
      topRow: clarifiaFace.top_row * height,
      rightCol: width - (clarifiaFace.right_col * width),
      bottomRow: height - (clarifiaFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render () {
    const { isSignedIn, box, imageUrl, route } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.firstname} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : 
          (
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )   
        }   
      </div>
    );
  }
}

export default App;
