import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import "../styles/App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import HomePage from "./homepage/HomePage";
import SingleDayPage from "./single-day-page/SingleDayPage";
import UserPage from './user-page/UserPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<UserPage />} />
              <Route path="/day/:date/:cityId" element={<SingleDayPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
