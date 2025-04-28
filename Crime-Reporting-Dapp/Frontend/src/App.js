// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './style.css';
import Navbar from './components/Navbar'; // 👈 New Navbar component
import Home from './views/home';
import Dashboard from './views/dashboard';
import Reports from './views/Reports';
import AdminDash from './views/admin-dash';
import NotFound from './views/not-found';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* 👈 Top navigation added */}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/admin-dash" component={AdminDash} />
        <Route component={NotFound} />
        <Redirect to="**" />
      </Switch>
    </Router>
  );
};

export default App;
