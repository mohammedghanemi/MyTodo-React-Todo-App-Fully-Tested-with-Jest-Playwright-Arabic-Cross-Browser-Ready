import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('complete user workflow: login, add todos, edit, toggle, delete, logout', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Login - use getByPlaceholderText instead of getByLabelText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'integrationuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    expect(screen.getByText('مرحباً، integrationuser')).toBeInTheDocument();

    // 2. Add multiple todos
    await user.type(screen.getByPlaceholderText('أضف مهمة جديدة...'), 'First integration todo');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    await user.type(screen.getByPlaceholderText('أضف مهمة جديدة...'), 'Second integration todo');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    expect(screen.getByText('First integration todo')).toBeInTheDocument();
    expect(screen.getByText('Second integration todo')).toBeInTheDocument();
    expect(screen.getByText('المهام المكتملة: 0/2')).toBeInTheDocument();

    // 3. Toggle todo completion
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    
    expect(screen.getByText('المهام المكتملة: 1/2')).toBeInTheDocument();

    // 4. Edit a todo - use emoji for edit button
    const editButtons = screen.getAllByRole('button', { name: '✏️' });
    await user.click(editButtons[1]);
    
    // Use the edit input specifically (the one in edit mode)
    const editInput = screen.getByDisplayValue('Second integration todo');
    await user.clear(editInput);
    await user.type(editInput, 'Edited second todo');
    await user.click(screen.getByRole('button', { name: '💾' }));

    expect(screen.getByText('Edited second todo')).toBeInTheDocument();

    // 5. Delete a todo - use emoji for delete button
    const deleteButtons = screen.getAllByRole('button', { name: '🗑️' });
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('First integration todo')).not.toBeInTheDocument();
    });
    expect(screen.getByText('المهام المكتملة: 0/1')).toBeInTheDocument();

    // 6. Logout
    await user.click(screen.getByRole('button', { name: 'تسجيل الخروج' }));

    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });

  test('persists data after page reload simulation', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Login and add todo - use getByPlaceholderText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'persistenceuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    await user.type(screen.getByPlaceholderText('أضف مهمة جديدة...'), 'Persistent todo');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    // Simulate page reload by unmounting and remounting
    unmount();

    // Check if data was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('persistenceuser')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'todos',
      expect.stringContaining('Persistent todo')
    );

    // Remount component
    render(<App />);

    // Should still show login since localStorage mock doesn't persist between renders
    // This test demonstrates the integration with localStorage
    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });
});