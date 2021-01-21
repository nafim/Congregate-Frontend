import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './views/Home/Home';
import Play from './views/Play/Play';

function App() {
  return (
    <Router>
    <div>
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/play">
                <Play />
            </Route>
        </Switch>
    </div>
</Router>
  );
}

export default App;
