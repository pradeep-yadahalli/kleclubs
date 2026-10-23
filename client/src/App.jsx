
import { useState, useEffect } from 'react';
import './App.css';
import { getEvents } from './services/eventService';

function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getEvents();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

  const categories = [
    'All',
    'Hackathons',
    'Workshops',
    'Competitions',
    'Cultural',
    'Recruitments',
  ];

  return (
    <div className="portal">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg bg-white portal-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand portal-brand" href="#home">
            <span className="brand-icon">K</span>
            KLE<span className="brand-highlight">Clubs</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#portalNavbar"
            aria-controls="portalNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="portalNavbar"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#events">Explore Events</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About Us</a>
              </li>
            </ul>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger portal-login"
                onClick={() => alert('Login page will be added in the next step.')}
              >
                Login
              </button>
              <button
                className="btn btn-danger portal-register"
                onClick={() => alert('Registration page will be added in the next step.')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="portal-hero" id="home">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="hero-label">
                YOUR CAMPUS. YOUR COMMUNITY.
              </span>

              <h1 className="hero-title">
                Discover events.
                <br />
                Find your <span>people.</span>
              </h1>

              <p className="hero-description">
                Explore college events, join clubs, showcase your
                talents and make your campus experience count.
                Everything happening on campus, in one place.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#events" className="btn btn-danger hero-button">
                  Explore Events <span aria-hidden="true">→</span>
                </a>
                <button
                  className="btn btn-outline-dark hero-secondary"
                  onClick={() => alert('Student registration will be added in the next step.')}
                >
                  Join the Community
                </button>
              </div>

              <div className="hero-note mt-4">
                <span className="note-dot"></span>
                One campus. Endless opportunities.
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-visual">
                <div className="visual-decoration decoration-one"></div>
                <div className="visual-decoration decoration-two"></div>

                <div className="visual-card main-visual-card">
                  <div className="visual-topline">
                    <span className="visual-live-dot"></span>
                    CAMPUS LIFE
                  </div>

                  <div className="visual-art" aria-hidden="true">
                    <div className="art-sun"></div>
                    <div className="art-building building-back"></div>
                    <div className="art-building building-front">
                      <div className="building-roof"></div>
                      <div className="building-columns">
                        <i></i><i></i><i></i><i></i>
                      </div>
                    </div>
                    <div className="art-ground"></div>
                  </div>

                  <h3>Make every moment count.</h3>
                  <p>Find something worth showing up for.</p>
                </div>

                <div className="floating-card floating-card-top">
                  <span className="floating-icon">✦</span>
                  <div>
                    <strong>Discover</strong>
                    <small>New opportunities</small>
                  </div>
                </div>

                <div className="floating-card floating-card-bottom">
                  <span className="floating-icon">♥</span>
                  <div>
                    <strong>Connect</strong>
                    <small>Find your community</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Event Discovery */}
      <section className="events-section" id="events">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">WHAT'S HAPPENING</span>
              <h2>Explore campus life</h2>
              <p>Find events and opportunities that interest you.</p>
            </div>

            <span className="event-count-label">EVENT DISCOVERY</span>
          </div>

          <div className="event-toolbar">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${
                    activeCategory === category ? 'selected' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search events"
              />
            </div>
          </div>

          <div className="empty-events">
            <div className="empty-events-icon" aria-hidden="true">✦</div>
            <h3>Your next opportunity starts here.</h3>
           
{loading ? (
  <p>Loading events...</p>
) : error ? (
  <p role="alert">{error}</p>
) : events.length === 0 ? (
  <p>
    No events are available right now. Please check again soon!
  </p>
) : (
  <div className="events-grid">
    {events.map((event) => (
      <article className="event-card" key={event._id}>
        <h3>{event.title || event.name || 'Untitled Event'}</h3>

        {event.description && <p>{event.description}</p>}

        {event.date && (
          <p>
            <strong>Date:</strong>{' '}
            {new Date(event.date).toLocaleDateString()}
          </p>
        )}

        {event.venue && (
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
        )}
      </article>
    ))}
  </div>
)}

            <button
              className="btn btn-outline-danger"
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-content">
            <span className="section-eyebrow">BUILT FOR CAMPUS LIFE</span>
            <h2>More than events.<br />A place to belong.</h2>
            <p>
              KLEClubs brings campus activities, club opportunities
              and student participation together in one convenient
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="container footer-content">
          <a className="navbar-brand portal-brand" href="#home">
            <span className="brand-icon">K</span>
            KLE<span className="brand-highlight">Clubs</span>
          </a>
          <p>Connecting students with campus opportunities.</p>
          <span className="footer-copy">
            © {new Date().getFullYear()} KLEClubs
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
