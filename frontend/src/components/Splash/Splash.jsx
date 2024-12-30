import Search from '../Search';
import Featured from '../Featured';
import "./Splash.css";
import { NavLink } from 'react-router-dom';
import { LuUpload } from "react-icons/lu";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateShowModal from '../CreateShowModal';
import AddEpisodeModal from '../AddEpisodeModal/AddEpisodeModal';
import SignupFormModal from '../SignupFormModal';
import { useSelector } from 'react-redux';

const Splash = () => {

  let user = useSelector((state) => state.session.user);

  return (
    <main>
        <div className="hero-container">
          <div className="hero-gradient">
            <div className="hero-text">
              <h1 className='hero-header'>Your Voice, Amplified</h1>
              <h2 className='hero-sub-header'>create . upload . stream . podcast</h2>
            </div>
            <div className="hero-buttons">
              <button className="learn-more">
                Learn more
                <span className='tool-tip-text'>In Development</span>
              </button>
              {user?.showId ? null : (
                user && !user.showId ? (
                  <OpenModalMenuItem
                  className="sign-up"
                  itemText="Launch Your Podcast Today"
                  modalComponent={<CreateShowModal />}
                />
                ) : (
                  <OpenModalMenuItem
                    className="sign-up"
                    itemText="Launch Your Podcast Today"
                    modalComponent={<SignupFormModal />}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <div className='search-container'>
          <Search />
          or
          {!user ? (
          <OpenModalMenuItem
            className="sign-up-btn-search"
            itemText="Create Account"
            modalComponent={<SignupFormModal />}
          />
        ) : (
          <>
          {!user.showId ? (
            <OpenModalMenuItem
              className="create-show-btn-search"
              itemText="Create Show"
              modalComponent={<CreateShowModal />}
              user={user}
            />
          ) : (
            <OpenModalMenuItem
              className="upload-ep-search"
              itemText={
                <>
                  {<LuUpload />} Upload a podcast
                </>
              }
              modalComponent={<AddEpisodeModal />}
            />
          )}
          </>
        )}
        </div>
        <h2 className='featured-header'>
          Check out our featured list of Pod Vox podcasts
        </h2>
        <Featured />
        <NavLink className="browse" to="/browse">
          Browse Popular Podcasts
        </NavLink>
    </main>
  );
}

export default Splash;
