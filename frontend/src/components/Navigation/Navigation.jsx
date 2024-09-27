import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";


function Navigation() {
  const user = useSelector((state) => state.session.user);


  return (
    <ul className="nav-bar">
      <li>
        <NavLink to="/"><img className="nav-logo" src="../../images/podvox-nav-logo.svg" /></NavLink>
      </li>
      <li className="profile-button-container">

        <ProfileButton />
        {user && (
          user.profileImg?
          <div className="profile-image-container">
            <img
            className="profile-image"
            src={user.profileImg}
            style={{height: "70px", width: '70px', borderRadius: "50%"}}
            />
          </div> : <div className="profile-icon-container">
            <FaCircleUser className="profile-icon"/>
          </div>
        )}
      </li>
    </ul>
  );
}

export default Navigation;
