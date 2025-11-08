import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login'; 

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  test('renders login form with Arabic text', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    // Use more specific queries to avoid multiple matches
    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
    expect(screen.getByText(/اسم المستخدم:/)).toBeInTheDocument();
    expect(screen.getByText(/كلمة المرور:/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('أدخل اسم المستخدم')).toBeInTheDocument();
  });

  test('calls onLogin with username when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    // Use getByPlaceholderText instead of getByLabelText since labels aren't properly associated
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), 'testuser');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), 'password');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    expect(mockOnLogin).toHaveBeenCalledWith('testuser');
  });

  test('does not call onLogin when form is submitted with empty fields', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('does not call onLogin when form is submitted with whitespace only', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    // Use getByPlaceholderText instead of getByLabelText
    await user.type(screen.getByPlaceholderText('أدخل اسم المستخدم'), '   ');
    await user.type(screen.getByPlaceholderText('أدخل كلمة المرور'), '   ');
    await user.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));

    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});