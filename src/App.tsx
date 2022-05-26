import {Route, HashRouter as Router, Routes as Switch} from 'react-router-dom';
import './UI/css/index.scss';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" element={<Dashboard />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
