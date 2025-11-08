import React, { useState } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

function TodoList({ todos, onAddTodo, onEditTodo, onDeleteTodo, onToggleTodo }) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText);
      setNewTodoText('');
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list-container">
      <div className="todo-stats">
        <span>المهام المكتملة: {completedCount}/{totalCount}</span>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="أضف مهمة جديدة..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          إضافة
        </button>
      </form>

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="no-todos">لا توجد مهام حالياً. أضف مهمة جديدة!</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEditTodo}
              onDelete={onDeleteTodo}
              onToggle={onToggleTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;