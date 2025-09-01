"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./index.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navContainerRef = useRef(null);

  const navLinks = useMemo(
    () => [
      { name: "Url Shortner", href: "/short", icon: "/svg/linker.svg" },
      { name: "Paste", href: "/paste", icon: "/svg/paste.svg" },
      { name: "Upload", href: "/uploads", icon: "/svg/upload.svg" },
    ],
    []
  );

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";

    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const NavLink = ({ link, mobile = false }) => (
    <Link
      className={mobile ? styles.mobileLink : styles.navLink}
      href={link.href}
      onClick={mobile ? toggleMenu : undefined}
    >
      <img
        src={link.icon}
        alt={link.name}
        className={mobile ? styles.mobileIcon : styles.navIcon}
      />
      <span className={mobile ? styles.mobileText : styles.navText}>
        {link.name}
      </span>
    </Link>
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link
          className={styles.logoContainer}
          href="/"
          aria-label="Go to homepage"
        >
          <img
            src="/shortner.svg"
            alt="AnonShare Logo"
            className={styles.logoIcon}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className={styles.logoText}>Share8</span>
        </Link>

        <nav ref={navContainerRef} className={styles.navContainer}>
          <div className={styles.desktopLinks}>
            {navLinks.map((link) => (
              <NavLink key={link.name} link={link} />
            ))}
          </div>

          <button
            className={styles.hamburgerButton}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`${styles.hamburgerLine} ${
                  isMenuOpen
                    ? styles[
                        `line${num === 1 ? "One" : num === 2 ? "Two" : "Three"}`
                      ]
                    : ""
                }`}
              />
            ))}
          </button>
        </nav>

        <div
          ref={menuRef}
          className={`${styles.mobileMenu} ${
            isMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          {navLinks.map((link) => (
            <NavLink key={link.name} link={link} mobile />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
