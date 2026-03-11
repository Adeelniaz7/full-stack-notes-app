import React from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';

const routes = (
  <Router>
<Routes>
  <Route path="*" exact element={<Home/>}></Route>
  <Route path="/" exact element={<Home/>}/>
  <Route path="/Login" exact element={<Login/>}/>
  <Route path="/SignUp" exact element={<SignUp/>}/>
</Routes>
    </Router>
)

const App = () => {
  return  <div>{routes}</div>
}

export default App
