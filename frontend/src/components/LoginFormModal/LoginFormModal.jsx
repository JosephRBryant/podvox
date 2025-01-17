import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault;

    const serverResponse = await dispatch(
      thunkLogin({
        email: 'alice@user.io',
        password: 'password'
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  }

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-input">
          <div className="email-input">
            <label>
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="password-input">
            <label>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p>{errors.password}</p>}
          </div>
        </div>
        <div className="login-btns">
          <button className="login-btn" type="submit">Log In</button>
          <button className="demo-btn" onClick={handleDemoSubmit}>Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
