import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Welcome from './pages/Welcome';
import Home from './pages/home';
import QuizSummary from './pages/QuizSummary';
import QuizStart from './pages/QuizStart';
import Performance from './pages/Performance';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/quiz/:quizId" component={QuizSummary} />
        <Route path="/quiz/:quizId/start" component={QuizStart} />
        <Route exact path="/performance" component={Performance} />
      </Switch>
    </Router>
  );
}

export default App;
