const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test('should login with any credentials and see welcome message', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check if login page is displayed - use specific selectors
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();
    await expect(page.getByText('اسم المستخدم:')).toBeVisible();
    await expect(page.getByText('كلمة المرور:')).toBeVisible();

    // Fill login form - use getByPlaceholder
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('testuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('anypassword');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Check if login was successful
    await expect(page.getByText('مرحباً، testuser')).toBeVisible();
    await expect(page.getByText('قائمة المهام')).toBeVisible();
  });

  test('should logout and return to login page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Login first
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('testuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('anypassword');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Verify login
    await expect(page.getByText('مرحباً، testuser')).toBeVisible();

    // Logout
    await page.getByRole('button', { name: 'تسجيل الخروج' }).click();

    // Verify back to login page - use specific selector
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();
  });

  test('should show validation for empty login fields', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Try to submit empty form
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Should stay on login page - use specific selector
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();
  });

  test('should persist login after page refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Login
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('persistentuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Verify login
    await expect(page.getByText('مرحباً، persistentuser')).toBeVisible();

    // Refresh page
    await page.reload();

    // Should still be logged in
    await expect(page.getByText('مرحباً، persistentuser')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).not.toBeVisible();
  });
});