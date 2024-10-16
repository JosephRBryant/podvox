import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { LuLogOut } from "react-icons/lu";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import "./ProfileButton.css";
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  let user = useSelector((state) => state.session.user);

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

  },[user])

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate('/');
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
        <div className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <div className="profile-dropdown-container">
              <NavLink to='/account'>
                Manage Account
              </NavLink>
              {!user.showId ? null : (
                <NavLink to={`/shows/${user.showId}`}>
                  Visit Show Page
                </NavLink>
              )}
              <button className="sign-out" onClick={logout}>
                <LuLogOut />
                Sign out
              </button>
            </div>
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
        </div>
      )}
    </>
  );
}

export default ProfileButton;
