import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../../components/TodoList';

describe('TodoList Component', () => {
  const mockTodos = [
    { id: 1, text: 'First todo', completed: false },
    { id: 2, text: 'Second todo', completed: true },
    { id: 3, text: 'Third todo', completed: false }
  ];

  const mockOnAddTodo = jest.fn();
  const mockOnEditTodo = jest.fn();
  const mockOnDeleteTodo = jest.fn();
  const mockOnToggleTodo = jest.fn();

  beforeEach(() => {
    mockOnAddTodo.mockClear();
    mockOnEditTodo.mockClear();
    mockOnDeleteTodo.mockClear();
    mockOnToggleTodo.mockClear();
  });

  test('renders todo list with stats', () => {
    render(
      <TodoList 
        todos={mockTodos}
        onAddTodo={mockOnAddTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
        onToggleTodo={mockOnToggleTodo}
      />
    );

    expect(screen.getByText('المهام المكتملة: 1/3')).toBeInTheDocument();
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
  });

  test('renders empty state when no todos', () => {
    render(
      <TodoList 
        todos={[]}
        onAddTodo={mockOnAddTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
        onToggleTodo={mockOnToggleTodo}
      />
    );

    expect(screen.getByText('لا توجد مهام حالياً. أضف مهمة جديدة!')).toBeInTheDocument();
  });

  test('calls onAddTodo when new todo is submitted', async () => {
    const user = userEvent.setup();
    render(
      <TodoList 
        todos={[]}
        onAddTodo={mockOnAddTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
        onToggleTodo={mockOnToggleTodo}
      />
    );

    await user.type(screen.getByPlaceholderText('أضف مهمة جديدة...'), 'New todo item');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    expect(mockOnAddTodo).toHaveBeenCalledWith('New todo item');
  });

  test('clears input after adding todo', async () => {
    const user = userEvent.setup();
    render(
      <TodoList 
        todos={[]}
        onAddTodo={mockOnAddTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
        onToggleTodo={mockOnToggleTodo}
      />
    );

    const input = screen.getByPlaceholderText('أضف مهمة جديدة...');
    await user.type(input, 'New todo item');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    expect(input).toHaveValue('');
  });

  test('does not call onAddTodo when submitting empty todo', async () => {
    const user = userEvent.setup();
    render(
      <TodoList 
        todos={[]}
        onAddTodo={mockOnAddTodo}
        onEditTodo={mockOnEditTodo}
        onDeleteTodo={mockOnDeleteTodo}
        onToggleTodo={mockOnToggleTodo}
      />
    );

    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });
});