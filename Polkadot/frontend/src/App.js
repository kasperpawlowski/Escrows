import {Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Trade from './components/Trade';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes >
        <Route path='/' element={<Home />} exact />
        //<Route path='/trade' element={<Trade />} />
        <Route render={function () {
          return <p>Not found</p>
        }} />
      </Routes>
    </div>
  );
}

export default App;
