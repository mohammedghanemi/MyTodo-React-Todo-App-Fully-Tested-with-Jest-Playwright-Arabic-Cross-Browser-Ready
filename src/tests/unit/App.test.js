import React from 'react';
import { render, screen, act } from '@testing-library/react';
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

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('renders login page initially when not logged in', () => {
    render(<App />);
    // Use getByRole for heading instead of getByText to avoid multiple matches
    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });

  test('logs in and shows todo list', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Use getByPlaceholderText instead of getByLabelText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'testuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    expect(screen.getByText('مرحباً، testuser')).toBeInTheDocument();
    expect(screen.getByText('لا توجد مهام حالياً. أضف مهمة جديدة!')).toBeInTheDocument();
  });

  test('adds new todo item', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Login first - use getByPlaceholderText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'testuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    // Add todo
    await user.type(screen.getByPlaceholderText('أضف مهمة جديدة...'), 'Test todo');
    await user.click(screen.getByRole('button', { name: 'إضافة' }));

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('logs out and returns to login page', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Login first - use getByPlaceholderText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'testuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    // Logout
    await user.click(screen.getByRole('button', { name: 'تسجيل الخروج' }));

    // Use getByRole for heading instead of getByText
    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });
});