import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text-container">
          <div className="new-badge">
            New Drops{" "}
            <Link href="#" className="new-badge-link">
              here
            </Link>
          </div>
          <h1 className="hero-heading">
            Your Car Deserves the <br />
            <span className="gradient-text"> Best </span>
            on internet
          </h1>
          <p className="hero-paragraph">
          Because a clean ride just feels better—every drive is smoother, every shine lasts longer, and every wash feels effortless. Say goodbye to dirt and dullness, and hello to a car that always looks its best!
          </p>
          <div className="button-container">
            <Link href="#" className="join-button">
              <span>Join Us</span>
            </Link>
         
          </div>
          <div className="listeners-container">
            <div className="avatars-container">
             
           
             
            </div>
            <span className="listeners-text">WorldWide listeners</span>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="image-gradient"></div>
          <div className="main-image-wrapper">
            <Image
              src="/images/sidebiew.webp"
              alt="img not loading"
              width={900}
              height={900}
              loading="lazy"
              className="main-image"
            />
          </div>
          <div className="secondary-image-wrapper">
            <Image
              src="/images/sidebiew.webp"
              alt="img not loading"
              width={900}
              height={900}
              loading="lazy"
              className="secondary-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
