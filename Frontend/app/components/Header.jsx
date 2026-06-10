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
      const menuHalfWidth = name === "Sarees" ? 125 : 150;
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
    const phone = String(auth?.user?.phone || "").replace(/\D/g, "");
    setIsAdmin(auth?.user?.role === "admin" || ["9704888933", "9949779227", "9014011885"].includes(phone));

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
          className={`dropdown-menu dropdown-portal-menu is-portal-open ${openMenu === "Sarees" ? "is-compact" : ""}`}
          style={{
            "--dropdown-left": `${dropdownPosition.left}px`,
            "--dropdown-top": `${dropdownPosition.top}px`
          }}
          onMouseEnter={() => openDropdown(openMenu)}
          onMouseLeave={scheduleDropdownClose}
        >
          {menus[openMenu].map((item) => (
            <Link key={item} href={`/${encodeURIComponent(item)}`} onClick={closeMenus}>
              {item}
            </Link>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <>
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
              <div
                className="dropdown-menu inline-dropdown-menu"
                onMouseEnter={() => {
                  if (isDesktop) openDropdown(name);
                }}
                onMouseLeave={() => {
                  if (isDesktop) scheduleDropdownClose();
                }}
              >
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
          <Link className="icon-button" href="/search" aria-label="Search"><Icon name="search" /></Link>
          <Link className="icon-button" href="/wishlist" aria-label="Wishlist"><Icon name="heart" /></Link>
          <div className="profile-menu">
            <Link className="icon-button login-button" href="/signup" aria-label="Profile"><Icon name="user" /></Link>
            <div className="profile-dropdown">
              <Link href="/profile">My Profile</Link>
              <Link href="/profile#orders">My Orders</Link>
              <Link href="/signup">Sign Up</Link>
              <Link href="/login">Sign In</Link>
              {isAdmin && <Link href="/admin">Admin Panel</Link>}
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
