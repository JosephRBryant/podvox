import './ManageAccount.css';
import { useDispatch, useSelector } from 'react-redux';
import UpdateAccount from '../UpdateAccount/UpdateAccount';
import UpdateShow from '../UpdateShow/UpdateShow';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateShowModal from '../CreateShowModal';
import { useEffect, useState } from 'react';
import { fetchUser } from '../../redux/session';
import { getOneShowThunk } from '../../redux/show';

const ManageAccount = () => {
  const user = useSelector(state => state.session.user);
  const show = useSelector(state => state.showState.showDetails)
  const [hasShowId, setHasShowId] = useState(Boolean(user?.showId));
  const dispatch = useDispatch();

  useEffect(() => {
    setHasShowId(Boolean(user?.showId));
  }, [user?.showId]);

  useEffect(() => {
    if (user?.showId) {
      dispatch(getOneShowThunk(user.showId));
    }
  }, [dispatch, user?.showId])
  return (
    <main className="manage-account-container">
      <div className="account-show-container">
        <UpdateAccount user={user}/>
        {hasShowId ? (
          <UpdateShow userId={user.id}/>
        ) : (
          <div className='show-info-create-container'>
            <h2>Show Info</h2>
            <OpenModalMenuItem
                className="manage-show-create-show-btn"
                itemText="Create Show"
                modalComponent={<CreateShowModal />}
                user={user}
              />
          </div>
        )}
      </div>
    </main>
  )
}

export default ManageAccount;
