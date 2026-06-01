"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { media } from "../data/media";

const menus = {
  "Heritage Sarees": ["Kanjivaram Silks", "Banaras Silks", "Gadwal Pattu", "Mysore Silk", "Paithani Silk", "Jamdani Silk", "Muga Silk"],
  "Signature Sarees": ["Tussar", "Organza", "Ikkat", "Patola Silk", "Patan Patola", "Chanderi Silk", "Kota Silk"],
  Sarees: ["Linen Silk", "Kora Silk", "Semi Kota", "Soft Silk", "Uppada Silk"]
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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
                <Link key={item} href={`/${encodeURIComponent(item)}`}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/Sahanvi%20Vintage">Sahanvi Vintage</Link>
      </nav>

      <div className="header-actions">
        <button className="currency" type="button">INR</button>
        <button className="icon-button" type="button" aria-label="Search">⌕</button>
        <button className="icon-button" type="button" aria-label="Wishlist">♡</button>
        <div className="profile-menu">
          <Link className="icon-button login-button" href="/signup" aria-label="Profile">♙</Link>
          <div className="profile-dropdown">
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Sign In</Link>
            {isAdmin && <Link href="/admin">Admin Panel</Link>}
          </div>
        </div>
        <button className="icon-button cart-button" type="button" aria-label="Cart">♧</button>
        <button className="icon-button menu-button" type="button" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}
