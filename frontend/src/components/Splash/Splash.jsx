import React from 'react';
import Search from '../Search';
import Featured from '../Featured';
import "./Splash.css";
import { NavLink } from 'react-router-dom';

const Splash = () => {

  return (
    <main>
        <div className="hero-container">
          <div className="hero-gradient">
            <div className="hero-text">
              <h1 className='hero-header'>Your Voice, Amplified</h1>
              <h2 className='hero-sub-header'>create . upload . stream . podcast</h2>
            </div>
            <div className="hero-buttons">
              <button className="learn-more">
                Learn more
              </button>
              <button className="sign-up">
                Launch Your Podcast Today
              </button>
            </div>
          </div>
        </div>
        <div className='search-container'>
          <Search />
          or
          <button className='upload'>Upload a podcast</button>
        </div>
        <h2 className='featured-header'>
          Check out our featured list of Pod Vox podcasts
        </h2>
        <Featured />
        <NavLink className="browse" to="/browse">
          Browse Popular Podcasts
        </NavLink>
    </main>
  );
}

export default Splash;
