import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";

import type { RootState } from "@/store";

import Logo from "../../assets/icons/logo";
import { FaSearch, FaTimes, FaShoppingCart , FaUser } from "react-icons/fa";

type HeaderType = {
  isErrorPage?: boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const arrayPaths = ["/"];

  const [onTop, setOnTop] = useState(
    !(!arrayPaths.includes(router.pathname) || isErrorPage),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(false);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);

  return (
    <header className={`site-header ${!onTop ? "site-header--fixed" : ""}`}>
      <div className="container">
        <Link href="/">
          <h1 className="site-logo ">
            <Logo />
            KMV Industries
          </h1>
        </Link>
        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
          style={{ backgroundColor: "white" }}
        >
            <Link className="site-nav-link" href="/products" style={{ color: "black" }}>Products</Link>
          <Link className="site-nav-link"  href="#" style={{ color: "black" }}  >Inspiration</Link>
          <Link className="site-nav-link"  href="#" style={{ color: "black" }} >Rooms</Link>
          <button className="site-nav__btn">
            <p>Account</p>
          </button>
        </nav>

        <div className="site-header__actions">
            <button
            ref={searchRef}
            className={`search-form-wrapper ${searchOpen ? "search-form--active" : ""}`}
            >
            <form className="search-form">
              <FaTimes
              className="icon-cancel"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ color: "black" }}
              />
              <input
              type="text"
              name="search"
              placeholder="Enter the product you are looking for"
              className="input-black"
              />
            </form>
            <FaSearch
              onClick={() => setSearchOpen(!searchOpen)}
              className="icon-search"
              style={{ color: "black" }}
            />
            </button>
            <Link href="/cart" legacyBehavior>
            <button className="btn-cart">
              <FaShoppingCart style={{ color: "black" }} />
              {cartItems.length > 0 && (
              <span className="btn-cart__count">{cartItems.length}</span>
              )}
            </button>
          </Link>
            <Link href="/login" legacyBehavior>
            <button className="site-header__btn-avatar">
              <FaUser style={{ color: "black" }} />
            </button>
            </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="site-header__btn-menu"
          >
            <i className="btn-hamburger" style={{ backgroundColor: "white" }}>
              <span />
            </i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
