import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { LuLogOut } from "react-icons/lu";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { getOneShowThunk } from "../../redux/show";
import LoginFormModal from "../LoginFormModal";
import "./ProfileButton.css";
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  let user = useSelector((state) => state.session.user);
  let show = useSelector((state) => state.showState.showDetails);

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

  const goToShowPage = (e) => {
    e.preventDefault();
    dispatch(getOneShowThunk(show.id));
    navigate(`/shows/${user.showId}`);
    toggleMenu(e);
  };

  const logout = (e) => {
    e.preventDefault();
    setShowMenu(false);
    navigate('/');
    dispatch(thunkLogout());
    // closeMenu();
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
        <div className="profile-dropdown" ref={ulRef}>
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
          )}
        </div>
      )}
    </>
  );
}

export default ProfileButton;
