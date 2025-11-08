import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onEdit, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />

      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <button onClick={handleEdit} className="save-btn">💾</button>
          <button onClick={handleCancel} className="cancel-btn">❌</button>
        </div>
      ) : (
        <div className="view-mode">
          <span 
            className="todo-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
          <div className="todo-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              title="تعديل"
            >
              ✏️
            </button>
            <button 
              onClick={() => onDelete(todo.id)}
              className="delete-btn"
              title="حذف"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;