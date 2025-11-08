import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>تسجيل الدخول</h2>
        <div className="form-group">
          <label>اسم المستخدم:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="أدخل اسم المستخدم"
          />
        </div>
        <div className="form-group">
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="أدخل كلمة المرور"
          />
        </div>
        <button type="submit" className="login-btn">
          تسجيل الدخول
        </button>
        <p className="demo-info">
          💡 للمعاينة: يمكن استخدام أي اسم مستخدم وكلمة مرور
        </p>
      </form>
    </div>
  );
}

export default Login;