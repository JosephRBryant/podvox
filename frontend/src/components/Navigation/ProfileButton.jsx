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
    console.log('create account-----', user.username)


    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  useEffect(() => {
    console.log('User updated in ProfileButton:', user);
    setIsUserLoaded(!!user?.username);
  }, [user]);

  // const closeMenu = () => setShowMenu(false);

  const goToShowPage = (e) => {
    e.preventDefault();
    navigate(`/shows/${user.showId}`);
    toggleMenu(e);
  };

  const logout = (e) => {
    e.preventDefault();
    navigate('/');
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      {user ? (
        <button className="profile-btn" onClick={toggleMenu}>
          {user.username || 'Loading...'}
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
              <NavLink className="manage-account-btn" to='/account' onClick={toggleMenu}>
                Manage Account
              </NavLink>
              {!user.showId ? null : (
                <div className="visit-show-btn" onClick={goToShowPage}>
                  Visit Show Page
                </div>
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
