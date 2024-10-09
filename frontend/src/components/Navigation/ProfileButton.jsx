import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { LuLogOut } from "react-icons/lu";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import "./ProfileButton.css";
import { NavLink } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  let user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true)
    }
  },[user])

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      {user ? (
        <button className="profile-btn" onClick={toggleMenu}>
          {user.username}
        </button>
      ) : (
        <OpenModalMenuItem
                className="log-in-btn"
                itemText="Log In"
                modalComponent={<LoginFormModal />}
              />
      )}
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <NavLink to='/'>
                Manage Account
              </NavLink>
              <NavLink to={`/shows/`}>
                Visit Show Page
              </NavLink>
              <li>
                <button className="sign-out" onClick={logout}>
                  <LuLogOut />
                  Sign out
                </button>
              </li>
            </>
          ) : (
            null
            // <>
            //   <OpenModalMenuItem
            //     itemText="Log In"
            //     onItemClick={closeMenu}
            //     modalComponent={<LoginFormModal />}
            //   />
            // </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
