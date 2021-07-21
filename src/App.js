import React from 'react';
import GameOfLife from './components/gameOfLiveCanvas'
import Blog from './components/gameOfLife'
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route, HashRouter } from 'react-router-dom'
function App() {
  return (
    <HashRouter>
        <Route path="/" component={NavBar}/>
        <Route path="/:id" component={NavBar}/>
        <Route exact path="/blog" component={Blog}/>
        <Route exact path="/" component={GameOfLife}/>
        <Route exact path="/home" component={GameOfLife}/>
    </HashRouter>
  );
}

export default App;
