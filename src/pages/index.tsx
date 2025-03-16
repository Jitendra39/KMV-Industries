import Footer from "@/components/footer";

import ProductsFeatured from "@/components/products-featured";
import Subscribe from "@/components/subscribe";

import Layout from "../layouts/Main";
import HeroSection from "@/components/hero-section/herosection";

const IndexPage = () => {
  return (
    <Layout>
     
     <HeroSection/>

      <section className="featured">
        <div className="container">
          <article
            style={{ backgroundImage: "url(/images/featured-1.png)" }}
            className="featured-item featured-item-large"
          >
            <div className="featured-item__content">
              <h3>
                Get the best deals on <br />
                <strong>Car Care Products</strong>
              </h3>
              <a href="#" className="btn btn--rounded">
                Show Collection
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-2.webp)" }}
            className="featured-item featured-item-small-first"
          >
            <div className="featured-item__content">
              <h3>Crystal-Clear Shine with <br />
                <strong>DFA technology</strong> 
              </h3>
              <a href="#" className="btn btn--rounded">
                More details
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-3.webp)" }}
            className="featured-item featured-item-small"
          >
            <div className="featured-item__content">
              <h3>
                Car Care made<br />
                <strong></strong>
                 </h3>
              <a href="#" className="btn btn--rounded">
                VIEW ALL
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section__intro">
            <h4>Why should you choose us?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>
                  All purchases over ₹499 are eligible for free shipping via
                  Delhivery Mail.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-payment" />
              <div className="data-item__content">
                <h4>Easy Payments</h4>
                <p>
                  All payments are processed instantly over a secure payment
                  protocol.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Money-Back Guarantee</h4>
                <p>
                  If an item arrived damaged or you've changed your mind, you
                  can send it back for a full refund.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-materials" />
              <div className="data-item__content">
                <h4>Finest Quality</h4>
                <p>
                  Designed to last, each of our products has been crafted with
                  the finest materials.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <ProductsFeatured />
      <Subscribe />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
