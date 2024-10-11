import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { LuUpload } from "react-icons/lu";
import AddEpisodeModal from "../AddEpisodeModal/AddEpisodeModal";
import { getUserShowsThunk } from "../../redux/show";
import CreateShowModal from "../CreateShowModal";


function Navigation() {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.session.user);
  let userShows = useSelector((state) => state.showState.userShows);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  console.log('userShows', userShows)

  useEffect(() => {
    if (user) {
      dispatch(getUserShowsThunk(user.id));
      setIsUserLoaded(true)
    }
  }, [dispatch, user])


  return (
    <ul className="nav-bar">
      <li>
        <NavLink to="/"><img className="nav-logo" src="../../images/podvox-nav-logo.svg" /></NavLink>
      </li>
      <div className="nav-menu">
        <NavLink className="about-btn" to="/about">About</NavLink>
        <div className="shows-menu-btn">Shows</div>
        {/* <button className="sign-up-btn">Create Account</button> */}
        {!user ? (
          <OpenModalMenuItem
            className="sign-up-btn"
            itemText="Create Account"
            modalComponent={<SignupFormModal />}
          />
        ) : (
          <>
          {!userShows ? (
            <OpenModalMenuItem
              className="create-show-btn"
              itemText="Create Show"
              modalComponent={<CreateShowModal />}
              user={user}
            />
          ) : (
            <OpenModalMenuItem
              className="upload-ep"
              itemText={
                <>
                  {<LuUpload />} Upload
                </>
              }
              modalComponent={<AddEpisodeModal />}
            />
          )}
          </>
        )}
        <li className="profile-button-container" id="prof-btn-cont">
          <ProfileButton />
          {user && isUserLoaded ? (
            user.profileImg ? (
              <div className="profile-image-container">
                <img
                className="profile-image"
                src={user.profileImg}
                style={{height: "70px", width: '70px', borderRadius: "50%"}}
                />
              </div>
              ) : (
                <div className="profile-icon-container">
                  <FaCircleUser className="profile-icon"/>
                </div>
              )
          ) : null }
        </li>
      </div>
    </ul>
  );
}

export default Navigation;
