import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { LuUpload } from "react-icons/lu";
import AddEpisodeModal from "../AddEpisodeModal/AddEpisodeModal";
// import { getUserShowsThunk } from "../../redux/show";
import CreateShowModal from "../CreateShowModal";

function Navigation() {
  let user = useSelector((state) => state.session.user);

  return (
    <ul className="nav-bar">
      <li>
        <NavLink to="/"><img className="nav-logo" src="https://toginet.com/images/podvox/podvox-nav-logo.svg" /></NavLink>
      </li>
      <div className="nav-menu">
        <div className="about-btn">
          About
          <span className='tool-tip-text'>In Development</span>
        </div>
        <div className="shows-menu-btn">
          Shows
          <span className='tool-tip-text'>In Development</span>
        </div>
        {/* <button className="sign-up-btn">Create Account</button> */}
        {!user ? (
          <OpenModalMenuItem
            className="sign-up-btn"
            itemText="Create Account"
            modalComponent={<SignupFormModal />}
          />
        ) : (
          <>
          {!user.showId ? (
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
          {!user ? null : (
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
          )}
        </li>
      </div>
    </ul>
  );
}

export default Navigation;
