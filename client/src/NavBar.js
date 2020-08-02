
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRandom } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

function NavBar() {
  return (
    <nav>
      <Link to="/" title="home" className="home-link">
        <FontAwesomeIcon icon={faHome} size="lg" color="white" />
      </Link>
      <h1 className="app-title">Connect</h1>
      <Link to="/walls/random" title="random" className="random-link">
        <FontAwesomeIcon icon={faRandom} size="lg" color="white" />
      </Link>
    </nav>
  );
}

export default NavBar;
