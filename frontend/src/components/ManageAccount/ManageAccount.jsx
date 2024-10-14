import './ManageAccount.css';
import { useSelector } from 'react-redux';
import UpdateAccount from '../UpdateAccount/UpdateAccount';
import UpdateShow from '../UpdateShow/UpdateShow';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateShowModal from '../CreateShowModal';

const ManageAccount = () => {
  const user = useSelector(state => state.session.user);
  const userShow = useSelector(state => state.showState.userShows);

  return (
    <main className="manage-account-container">
      <div className="account-show-container">
        <UpdateAccount user={user}/>
        {userShow.id ? (
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
