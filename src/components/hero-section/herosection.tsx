import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text-container">
          <div className="new-badge">
            New season available <Link href="#" className="new-badge-link">here</Link>
          </div>
          <h1 className="hero-heading">
            Find and listen <br /> Favorite
            <span className="gradient-text"> Podcast </span>
            on internet
          </h1>
          <p className="hero-paragraph">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, beatae omnis ipsa magnam neque
            ut nam nesciunt esse fugit praesentium hic magni possimus illo consequatur.
          </p>
          <div className="button-container">
            <Link href="#" className="join-button">
              <span>Join Us</span>
            </Link>
            <Link href="#" className="listen-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor" className="play-icon">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Listening Episode
              </span>
            </Link>
          </div>
          <div className="listeners-container">
            <div className="avatars-container">
              <Image src="/images/sidebiew.webp" height={900} width={1240} alt="avatar" className="avatar" />
              <Image src="/images/sidebiew.webp" height={900} width={1240} alt="avatar" className="avatar" />
              <Image src="/images/sidebiew.webp" height={900} width={1240} alt="avatar" className="avatar" />
              <Image src="/images/sidebiew.webp" height={900} width={1240} alt="avatar" className="avatar" />
              <span className="avatar-count">300+</span>
            </div>
            <span className="listeners-text">WorldWide listeners</span>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="image-gradient"></div>
          <div className="main-image-wrapper">
            <Image src="/images/sidebiew.webp" alt="In studio" width={900} height={900} loading="lazy" className="main-image" />
          </div>
          <div className="secondary-image-wrapper">
            <Image src="/images/sidebiew.webp" alt="Happy in studio" width={900} height={900} loading="lazy" className="secondary-image" />
          </div>
        </div>
      </div>
    </section>
  );
}