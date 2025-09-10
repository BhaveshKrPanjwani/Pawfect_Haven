// src/pages/HomePage.jsx
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/style.css";

const HomePage = () => {
  const navigate = useNavigate();

  const aboutUsRef = useRef(null);
  const whyStartedRef = useRef(null);

  const handleSupportChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "adopt") {
      navigate("/pets");
    } else if (selectedValue === "schedule") {
      navigate("/pet-schedule");
    } else if (selectedValue === "scores") {
      navigate("/credit-score");
    } else if (selectedValue === "donate") {
      navigate("/donations");
    } else if (selectedValue === "story") {
      navigate("/stories");
    }
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="home-page_body">
      <header>
        <nav className="navbar">
          <div className="logo-img">
            <img src={process.env.PUBLIC_URL + "/util/logo.jpeg"} alt="Pawfect Haven Logo" />
          </div>
          <div className="logo">
            <h1>Pawfect Haven</h1>
          </div>
          <div className="nav-text">
            <ul className="nav-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="#about-us-section" onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(aboutUsRef);
                }}>About Us</a>
              </li>

              <li>
                <select
                  id="support"
                  name="support"
                  className="dropdown"
                  onChange={handleSupportChange}
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    How can you Support?
                  </option>
                  <option value="donate">Donate</option>
                  <option value="adopt">Adopt a pet</option>
                  <option value="story">Share your story / View Stories</option>
                </select>
              </li>

              <li>
                <Link to="/sell-pet">Sell a Pet</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Make a Difference in the Lives of Animals</h1>
          <h4>Join us in rescuing, adopting, and protecting animals.</h4>
          <button className="cta-button" onClick={() => navigate("/signup")}>Get Involved</button>
        </div>
      </section>

      <section ref={aboutUsRef} id="about-us-section" className="about-us">
        <div className="about-us-txt">
          <p className="h1-txt">About Us</p>
          <p>
            At Pawfect Haven, we are building a community of passionate
            individuals dedicated to making a difference in the lives of
            animals. Our love for animals drives us to create a safe and
            compassionate world where every creature is treated with kindness
            and respect.
          </p>
        </div>
        <div className="our-mission">
          <div className="our-mission-img">
            <img
              className="mission-img"
              src={process.env.PUBLIC_URL + "/util/rescue-a-baby-birds.jpg"}
              alt="Rescue a baby bird"
            />
            <img
              className="mission-img"
              src={process.env.PUBLIC_URL + "/util/why-is-my-dog-crying.jpg"}
              alt="Why is my dog crying"
            />
          </div>
          <div className="mission-txt">
            <p className="h1-txt">Our mission</p>
            <p>
              Our mission is to promote animal welfare by spreading awareness,
              encouraging adoption, and supporting humane practices. We aim to
              be a voice for the voiceless, ensuring that every animal has the
              chance to live a happy, healthy, and loved life.
            </p>
          </div>
        </div>
        <div ref={whyStartedRef} id="why-started-section" className="why-started">
          <div className="mission-txt">
            <p className="h1-txt">Why We Started</p>
            <p>
              Pawfect Haven was born out of a deep concern for the welfare of
              animals in our community. Witnessing the struggles of stray and
              abandoned animals inspired us to take action. Though we are just
              beginning, we believe that even small steps can lead to big
              changes
            </p>
          </div>
          <div className="started-img">
            <img
              className="mission-img"
              src={process.env.PUBLIC_URL + "/util/starved-dog-1.jpg"}
              alt="Starved dog"
            />
            <img
              className="mission-img"
              src={process.env.PUBLIC_URL + "/util/crying-cow.jpeg"}
              alt="Crying cow"
            />
          </div>
        </div>
      </section>

      <section className="donation-simple">
        <div className="donation-content">
          <h2>Support Our Mission</h2>
          <button className="donate-button" onClick={() => navigate("/donations")}>Donate Now</button>
        </div>
        <div className="donation-image">
          <img src={process.env.PUBLIC_URL + "/util/mi_355_Donate_1352902479_1547.png"} alt="Donation " />
        </div>
      </section>

      <section className="adopt-pet">
        <div className="adoption">
          <div className="adoption-txt">
            <p className="h1-txt">Adopt a Pet</p>
          </div>
          <div className="content">
            <div className="pet">
              <img
                src={process.env.PUBLIC_URL + "/util/9b52f8ab775cf86eb51f1446f34e14da.jpg"}
                alt="Buddy the dog" // More descriptive alt text
              />
              <p>Meet Buddy, a playful and loving dog ready for adoption!</p>
              {/* IMPORTANT: Replace 'buddy_actual_id' with Buddy's real ID from your database */}
              <button className="cta-button" onClick={() => navigate("/adopt/buddy_actual_id")}>Adopt Buddy</button>
            </div>
            <div className="pet">
              <img src={process.env.PUBLIC_URL + "/util/maxresdefault.jpg"} alt="Bella the cat" /> {/* More descriptive alt text */}
              <p>Meet Bella, a sweet cat looking for her forever home.</p>
              {/* IMPORTANT: Replace 'bella_actual_id' with Bella's real ID from your database */}
              <button className="cta-button" onClick={() => navigate("/adopt/bella_actual_id")}>Adopt Bella</button>
            </div>
          </div>
        </div>
        <button className="cta-button" onClick={() => navigate("/pets")}>Show more</button>
      </section>

      <section className="adoption-stories">
        <div className="adoption-story">
          <div className="adoption-story-txt">
            <p className="h1-txt">Adoption stories</p>
          </div>
          <div className="story-section">
            <div className="help-option">
              <img
                src={process.env.PUBLIC_URL + "/util/story1.jpg"}
                alt="A happy dog with its new owner"
              />
              <p>
                "Adopting Bella changed my life. She brought so much joy and
                companionship into our home. Seeing her thrive after being
                rescued is the most rewarding experience." - Sarah
              </p>
            </div>
            <div className="help-option">
              <img
                src={process.env.PUBLIC_URL + "/util/himali-1200x550.jpg"}
                alt="A cat lounging in its new home"
              />
              <p>
                "When we adopted Whiskers, he was shy and scared. Now, he rules
                the house with his playful antics. Giving him a forever home has
                been a blessing for our family." - Arti and Anjana
              </p>
            </div>
            <div className="help-option">
              <img
                src={process.env.PUBLIC_URL + "/util/story3.webp"}
                alt="A dog enjoying playtime in its new backyard"
              />
              <p>
                "We started a fundraiser to help with rescue efforts, and it led
                us to adopt Kiku. Knowing we helped him and so many others makes
                his tail wags even more special." - Mohan
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section-links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="#about-us-section" onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(aboutUsRef);
                }}>Our Mission</a>
              </li>
              <li>
                <a href="#why-started-section" onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(whyStartedRef);
                }}>Why We Started</a>
              </li>
            </ul>
          </div>
          <div className="footer-section-contact">
            <h2>Contact Us</h2>
            <p>Email: info@pawfecthaven.org</p>
            <p>Phone: +91 123456789</p>
            <p>Address: Animal Welfare Street, Vellore</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Pawfect Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;