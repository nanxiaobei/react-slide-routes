import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Navigate, NavLink, Route } from 'react-router-dom';
import SlideRoutes from '../src';
import './main.css';

const Home = () => <div className="card home">Home</div>;
const About = () => <div className="card about">About</div>;
const Contact = () => <div className="card contact">Contact</div>;

const App = () => {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <SlideRoutes
        compare={(a, b) => {
          console.log({ a, b });
          return +b.id - +a.id;
        }}
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </SlideRoutes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
