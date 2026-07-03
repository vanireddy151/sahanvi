"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { media } from "../data/media";
import { menus } from "../data/navigation";

function Icon({ name }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.2-4.2" />
      </>
    ),
    heart: (
      <path d="M20.8 5.9c-1.5-1.8-4.2-1.7-5.8.1L12 9.1 9 6C7.4 4.2 4.7 4.1 3.2 5.9 1.6 7.8 2 10.6 3.8 12.3L12 20l8.2-7.7c1.8-1.7 2.2-4.5.6-6.4Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.4-4 4.3-6 8-6s6.6 2 8 6" />
      </>
    ),
    cart: (
      <>
        <path d="M6 6h15l-1.8 8.5H8.2L6 3H3" />
        <circle cx="9" cy="20" r="1.7" />
        <circle cx="18" cy="20" r="1.7" />
      </>
    ),
    facebook: <path d="M14 9h2.5V6.2h-2.5c-2 0-3.4 1.5-3.4 3.5V12H8v2.7h2.6V21h2.8v-6.3h2.4l.4-2.7h-2.8v-2c0-.6.5-1 1-1Z" />,
    instagram: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" />
      </>
    ),
    whatsapp: <path d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L3.5 20.5l4.5-1.2A8.4 8.4 0 1 0 12 3.5Zm0 1.7a6.6 6.6 0 1 1-3.4 12.3l-.4-.2-2.4.6.6-2.3-.2-.4A6.6 6.6 0 0 1 12 5.2Zm-2.3 3.3c-.2 0-.5 0-.6.3-.2.3-.7.8-.7 1.7 0 1 .7 2 .8 2.1.1.1 1.5 2.4 3.7 3.3 1.8.7 2.1.6 2.5.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.4-.2-.8-.4-.4-.2-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.7.8-.1.2-.3.2-.5.1-.7-.3-1.4-.8-2-1.5-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.4.1-.5.2-.2.3-.4.4-.6.1-.2 0-.4 0-.5-.1-.2-.6-1.5-.8-1.9-.1-.3-.3-.3-.5-.3Z" />,
    pinterest: <path d="M12 3.2A8.8 8.8 0 0 0 8.7 20c.4 0 .5-.2.5-.5l.1-1.9-.1-.1c-1.4-.3-2.3-1.5-2.3-3.1 0-2.9 2.1-5.4 5.5-5.4 3 0 4.6 1.8 4.6 4.3 0 3.2-1.4 5.5-3.4 5.5-1.1 0-1.9-.9-1.7-2 .4-1.6 1-3.3 1-4.4 0-1-.5-1.9-1.7-1.9-1.3 0-2.3 1.4-2.3 3.2 0 1.2.4 2 .4 2s-1.4 5.7-1.6 6.7c-.2.8-.1 1.8 0 2.5A8.8 8.8 0 0 0 12 3.2Z" />,
    youtube: (
      <>
        <rect x="3" y="6.5" width="18" height="11" rx="3" />
        <path d="m10.5 9.5 4.5 2.5-4.5 2.5Z" fill="#f8f4ef" />
      </>
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

const occasionLinks = ["Bridal", "Festive", "Casual Wear", "Party Wear", "Office Wear", "Gifting"];
const priceLinks = ["Under ₹10,000", "₹10,000 – ₹20,000", "₹20,000 – ₹30,000", "₹30,000 – ₹50,000", "Above ₹50,000"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 70 });
  const closeTimer = useRef(null);

  function clearDropdownClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openDropdown(name, target) {
    clearDropdownClose();
    if (target && typeof window !== "undefined" && window.innerWidth > 960) {
      const rect = target.getBoundingClientRect();
      const menuHalfWidth = 320;
      const viewportPadding = 18;
      const left = Math.min(
        Math.max(rect.left + rect.width / 2, viewportPadding + menuHalfWidth),
        window.innerWidth - viewportPadding - menuHalfWidth
      );

      setDropdownPosition({
        left,
        top: rect.bottom + 8
      });
    }
    setOpenMenu(name);
  }

  function scheduleDropdownClose() {
    clearDropdownClose();
    closeTimer.current = setTimeout(() => {
      setOpenMenu("");
      closeTimer.current = null;
    }, 900);
  }

  function closeMenus() {
    clearDropdownClose();
    setMenuOpen(false);
    setOpenMenu("");
  }

  function toggleDropdown(name, target) {
    clearDropdownClose();

    if (!isDesktop) {
      setOpenMenu((current) => (current === name ? "" : name));
      return;
    }

    if (openMenu === name) {
      setOpenMenu("");
      return;
    }

    openDropdown(name, target);
  }

  useEffect(() => {
    setMounted(true);
    const syncMode = () => setIsDesktop(window.innerWidth > 960);
    syncMode();
    window.addEventListener("resize", syncMode);

    const auth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    setIsLoggedIn(Boolean(auth?.user));
    setIsAdmin(auth?.user?.role === "admin");

    return () => {
      window.removeEventListener("resize", syncMode);
      clearDropdownClose();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", menuOpen && !isDesktop);
    document.body.classList.toggle("mobile-nav-expanded", menuOpen && !isDesktop && Boolean(openMenu));

    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.body.classList.remove("mobile-nav-expanded");
    };
  }, [menuOpen, isDesktop, openMenu]);

  const activeDropdown = mounted && isDesktop && openMenu && menus[openMenu]
    ? createPortal(
        <div
          className="dropdown-menu dropdown-portal-menu dropdown-mega is-portal-open"
          style={{
            "--dropdown-left": "0px",
            "--dropdown-top": `${dropdownPosition.top}px`
          }}
          onMouseEnter={() => openDropdown(openMenu)}
          onMouseLeave={scheduleDropdownClose}
        >
          {/* Text columns — compact group, not stretched */}
          <div className="dropdown-cols">
            <div className="dropdown-col">
              <span className="dropdown-col-heading">Shop by Type</span>
              {menus[openMenu].map((item) => (
                <Link key={item} href={`/${encodeURIComponent(item)}`} onClick={closeMenus}>
                  {item}
                </Link>
              ))}
            </div>

            <div className="dropdown-col">
              <span className="dropdown-col-heading">Shop by Occasion</span>
              {occasionLinks.map((item) => (
                <Link key={item} href={`/search?occasion=${encodeURIComponent(item)}`} onClick={closeMenus}>
                  {item}
                </Link>
              ))}
            </div>

            <div className="dropdown-col">
              <span className="dropdown-col-heading">Shop by Price</span>
              {priceLinks.map((item) => (
                <Link key={item} href={`/search?price=${encodeURIComponent(item)}`} onClick={closeMenus}>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Image tiles — pushed to the right */}
          <div className="dropdown-tiles">
            <Link className="dropdown-tile" href="/collections" onClick={closeMenus}>
              <img src={media.bannerPerson} alt="New Collection" />
              <span>New Collection</span>
            </Link>
            <Link className="dropdown-tile" href="/new-arrivals" onClick={closeMenus}>
              <img src={media.bannerPerson2} alt="New Arrivals" />
              <span>New Arrivals</span>
            </Link>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="announcement-bar">
        <div className="social-bar">
          <a className="social-bar-icon" href="#" aria-label="Facebook"><Icon name="facebook" /></a>
          <a className="social-bar-icon" href="#" aria-label="YouTube"><Icon name="youtube" /></a>
          <a className="social-bar-icon" href="#" aria-label="Instagram"><Icon name="instagram" /></a>
          <a className="social-bar-icon" href="#" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          <a className="social-bar-icon" href="#" aria-label="Pinterest"><Icon name="pinterest" /></a>
        </div>
        <p className="announcement-text">Pan-India Shipping &middot; Custom Blouse Stitching Available &middot; Easy Returns</p>
      </div>
      <header className="site-header">
        <Link className="brand logo-link" href="/">
          <img src={media.logo} alt="Sahanvi by Swapnavani" />
        </Link>

        <nav className={`nav-links ${menuOpen ? "next-open" : ""} ${openMenu ? "has-open-submenu" : ""}`}>
          {Object.entries(menus).map(([name, items]) => (
            <div
              className={`nav-item dropdown ${openMenu === name ? "is-open" : ""}`}
              key={name}
              onFocus={(event) => {
                if (isDesktop) openDropdown(name, event.currentTarget);
              }}
              onMouseEnter={(event) => {
                if (isDesktop) openDropdown(name, event.currentTarget);
              }}
              onMouseLeave={() => {
                if (isDesktop) scheduleDropdownClose();
              }}
            >
              <button
                type="button"
                aria-expanded={openMenu === name}
                onClick={(event) => {
                  toggleDropdown(name, event.currentTarget.parentElement);
                }}
              >
                {name}
              </button>
            </div>
          ))}
          <Link href="/Sahanvi%20Vintage" onClick={closeMenus}>Sahanvi Vintage</Link>
        </nav>

        <div className="header-actions">
          <button className="currency" type="button">INR</button>
          <Link className="icon-button" href="/search" aria-label="Search"><Icon name="search" /></Link>
          <Link className="icon-button" href="/wishlist" aria-label="Wishlist"><Icon name="heart" /></Link>
          <div className="profile-menu">
            <Link className="icon-button login-button" href="/signup" aria-label="Profile"><Icon name="user" /></Link>
            <div className="profile-dropdown">
              {isLoggedIn ? (
                <>
                  <Link href="/profile">My Profile</Link>
                  <Link href="/profile#orders">My Orders</Link>
                  {isAdmin && <Link href="/admin">Admin Panel</Link>}
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("sahanvi-auth");
                      localStorage.removeItem("sahanvi-customer-profile");
                      localStorage.removeItem("sahanvi-admin-session");
                      window.location.href = "/login";
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">Sign In</Link>
                  <Link href="/signup">Create Account</Link>
                </>
              )}
            </div>
          </div>
          <Link className="icon-button cart-button" href="/cart" aria-label="Cart"><Icon name="cart" /></Link>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => {
              clearDropdownClose();
              setMenuOpen((current) => {
                if (current) setOpenMenu("");
                return !current;
              });
            }}
          >
            ☰
          </button>
        </div>
      </header>
      {activeDropdown}
    </>
  );
}
