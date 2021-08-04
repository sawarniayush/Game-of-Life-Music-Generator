import React, { useState } from 'react';
import GameOfLife from './components/GameOfLife'
import Blog from './components/Blog'
import About from './components/About'
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route, HashRouter } from 'react-router-dom'
import Home from './components/Home';
function App() {
  const [gameState, setGameState] = useState(() => {
    return {
      isMusicOn: false,
      isAnimationOn: true,
      initialization: null
    }
  })
  return (
    <HashRouter>
      <GameOfLife gameState={gameState}/>
      <Route exact path="/" component={NavBar} />
      <Route exact path="/:id" component={NavBar} />


      <Switch>
        <Route exact path="/blog" component={Blog} />
        <Route exact path="/about" component={About} />
        <Route path="/" render={() => <Home setGameState={setGameState}></Home>} />
      </Switch>
    </HashRouter>
  );
}

export default App;
