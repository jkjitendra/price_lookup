import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../assets/styles/UserMenu.css";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <button ref={buttonRef} className="user-icon" onClick={toggleMenu}>
        <FaUserCircle size={45} />
      </button>

      {isOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <button className="menu-item">Update Profile</button>
          <button className="menu-item">Change Password</button>
          <button className="menu-item">Delete Account</button>
          <button className="menu-item logout">Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;