import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../styles/App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import MainPage from "./Mainpage";
import SingleDayPage from "./single-day-page/SingleDayPage";
import UserPage from './user-page/UserPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/day/:date/:cityId" element={<SingleDayPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
