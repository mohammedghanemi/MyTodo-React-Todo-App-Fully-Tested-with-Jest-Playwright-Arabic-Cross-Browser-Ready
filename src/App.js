import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import Login from './components/Login';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // تحميل البيانات من localStorage
    const savedTodos = localStorage.getItem('todos');
    const savedUser = localStorage.getItem('user');
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username) => {
    const userData = { username, loginTime: new Date().toISOString() };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const editTodo = (id, newText) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 قائمة المهام</h1>
        {isLoggedIn && (
          <div className="user-info">
            <span>مرحباً، {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              تسجيل الخروج
            </button>
          </div>
        )}
      </header>

      <main>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <TodoList
            todos={todos}
            onAddTodo={addTodo}
            onEditTodo={editTodo}
            onDeleteTodo={deleteTodo}
            onToggleTodo={toggleTodo}
          />
        )}
      </main>
    </div>
  );
}

export default App;