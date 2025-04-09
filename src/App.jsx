import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import About from './components/About.jsx';
import Hero from './components/Hero.jsx';
import Sports from './components/Sports.jsx';
import Boutique from './components/Boutique.jsx';

function App() {
  return (
    <Router>
      <div className="bg-[#f4ede4] min-h-screen">
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Sports />
              </>
            }
          />
          <Route path="/boutique" element={<Boutique />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
