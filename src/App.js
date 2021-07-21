import React from 'react';
import GameOfLife from './components/gameOfLiveCanvas'
import Blog from './components/gameOfLife'
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
function App() {
  return (
    <Router>
        <Route path="/" component={NavBar}/>
        <Route path="/:id" component={NavBar}/>
        <Route exact path="/blog" component={Blog}/>
        <Route exact path="/" component={GameOfLife}/>
        <Route exact path="/home" component={GameOfLife}/>
    </Router>
  );
}

export default App;
