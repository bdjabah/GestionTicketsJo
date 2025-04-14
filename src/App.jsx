import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import About from './components/About.jsx';
import Hero from './components/Hero.jsx';
import Sports from './components/Sports.jsx';
import Boutique from './components/Boutique.jsx';
import TicketForm from './components/TicketForm';
import Panier from './components/Panier.jsx';
import Connexion from './components/Connexion.jsx'
import Paiement from './components/Paiement.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow overflow-hidden sm:overflow-auto bg-[#f4ede4]">
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
            <Route path="/ticket/:type" element={<TicketForm />} />
            <Route path="/ticket/:type/edit" element={<TicketForm />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/paiement" element={<Paiement />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
