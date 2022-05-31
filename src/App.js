import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonList from "./components/PokemonList";
import "./App.css";
import TopBar from "./components/TopBar";

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" exact element={<PokemonList />} />
      </Routes>
    </Router>
  );
}

export default App;
