import React from 'react';
import './ManageAccount.css';
import { useSelector } from 'react-redux';
import UpdateAccount from '../UpdateAccount/UpdateAccount';
import UpdateShow from '../UpdateShow/UpdateShow';
const ManageAccount = () => {
  const user = useSelector(state => state.session.user);
  const userShow = useSelector(state => state.showState.userShows);


  return (
    <main className="manage-account-container">
      <div className="account-show-container">
        <UpdateAccount user={user}/>
        <UpdateShow userShow={userShow}/>
      </div>
    </main>
  )
}

export default ManageAccount;
