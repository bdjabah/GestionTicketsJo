import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import About from './components/About.jsx';
import Hero from './components/Hero.jsx';
import Sports from './components/Sports.jsx';
import Boutique from './components/Boutique.jsx';
import TicketForm from './components/TicketForm.jsx'; // Formulaire dynamique avec params

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f4ede4]">
        <Header />

        <main className="flex-grow">
          <Routes>
            {/* Page d'accueil */}
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

            {/* Page boutique */}
            <Route path="/boutique" element={<Boutique />} />

            {/* Formulaire ticket dynamique (type dans l'URL) */}
            <Route path="/ticket/:type" element={<TicketForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
