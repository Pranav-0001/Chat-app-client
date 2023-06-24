import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Componenets/Home/Home";
import Signup from "./Componenets/SignUp/signup";
import Login from "./Componenets/Login/login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>

      <Route path="/"  Component={Home}  exact />
      <Route path="/login"  Component={Login}  exact />
      <Route path="/signup"  Component={Signup}  exact />

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
