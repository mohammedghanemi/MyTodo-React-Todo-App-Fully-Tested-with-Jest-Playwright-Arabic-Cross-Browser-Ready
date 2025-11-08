import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../../components/TodoItem';

describe('TodoItem Component', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo item',
    completed: false
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnToggle.mockClear();
  });

  test('renders todo item with text', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText('Test todo item')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders completed todo with correct styling', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem 
        todo={completedTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.click(screen.getByTitle('تعديل'));
    expect(screen.getByDisplayValue('Test todo item')).toBeInTheDocument();
    expect(screen.getByText('💾')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  test('enters edit mode when text is double-clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.dblClick(screen.getByText('Test todo item'));
    expect(screen.getByDisplayValue('Test todo item')).toBeInTheDocument();
  });

  test('calls onEdit when save button is clicked with new text', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.click(screen.getByTitle('تعديل'));
    await user.clear(screen.getByDisplayValue('Test todo item'));
    await user.type(screen.getByDisplayValue(''), 'Updated todo');
    await user.click(screen.getByText('💾'));

    expect(mockOnEdit).toHaveBeenCalledWith(1, 'Updated todo');
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.click(screen.getByTitle('حذف'));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('cancels edit when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
      />
    );

    await user.click(screen.getByTitle('تعديل'));
    await user.clear(screen.getByDisplayValue('Test todo item'));
    await user.type(screen.getByDisplayValue(''), 'This will be cancelled');
    await user.click(screen.getByText('❌'));

    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Test todo item')).toBeInTheDocument();
  });
});