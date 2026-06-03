"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function closeMenus() {
    setMenuOpen(false);
    setOpenMenu("");
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    const phone = String(auth?.user?.phone || "").replace(/\D/g, "");
    setIsAdmin(auth?.user?.role === "admin" || ["9704888933", "9949779227"].includes(phone));
  }, []);

  return (
    <header className="site-header">
      <Link className="brand logo-link" href="/">
        <img src={media.logo} alt="Sahanvi by Swapnavani" />
      </Link>

      <nav className={`nav-links ${menuOpen ? "next-open" : ""}`}>
        {Object.entries(menus).map(([name, items]) => (
          <div className={`nav-item dropdown ${openMenu === name ? "is-open" : ""}`} key={name}>
            <button type="button" onClick={() => setOpenMenu(openMenu === name ? "" : name)}>
              {name}
            </button>
            <div className="dropdown-menu">
              {items.map((item) => (
                <Link key={item} href={`/${encodeURIComponent(item)}`} onClick={closeMenus}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/Sahanvi%20Vintage" onClick={closeMenus}>Sahanvi Vintage</Link>
      </nav>

      <div className="header-actions">
        <button className="currency" type="button">INR</button>
        <button className="icon-button" type="button" aria-label="Search"><Icon name="search" /></button>
        <button className="icon-button" type="button" aria-label="Wishlist"><Icon name="heart" /></button>
        <div className="profile-menu">
          <Link className="icon-button login-button" href="/signup" aria-label="Profile"><Icon name="user" /></Link>
          <div className="profile-dropdown">
            <Link href="/profile">My Profile</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Sign In</Link>
            {isAdmin && <Link href="/admin">Admin Panel</Link>}
          </div>
        </div>
        <Link className="icon-button cart-button" href="/cart" aria-label="Cart"><Icon name="cart" /></Link>
        <button className="icon-button menu-button" type="button" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}
