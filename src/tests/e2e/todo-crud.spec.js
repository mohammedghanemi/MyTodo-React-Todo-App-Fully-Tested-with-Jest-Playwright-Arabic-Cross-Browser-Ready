const { test, expect } = require('@playwright/test');

test.describe('Todo CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('testuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    await expect(page.getByText('مرحباً، testuser')).toBeVisible();
  });

  test('should add new todo item', async ({ page }) => {
    // Add new todo
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('New E2E test todo');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Verify todo is added
    await expect(page.getByText('New E2E test todo')).toBeVisible();
    await expect(page.getByText('المهام المكتملة: 0/1')).toBeVisible();
  });

  test('should not add empty todo', async ({ page }) => {
    // Try to add empty todo
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Should show empty state
    await expect(page.getByText('لا توجد مهام حالياً. أضف مهمة جديدة!')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // Add todo first
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('Todo to toggle');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Toggle completion
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.click();

    // Verify completion
    await expect(checkbox).toBeChecked();
    await expect(page.getByText('المهام المكتملة: 1/1')).toBeVisible();

    // Toggle back
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(page.getByText('المهام المكتملة: 0/1')).toBeVisible();
  });

  test('should edit todo item', async ({ page }) => {
    // Add todo first
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('Todo to edit');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Edit todo - use emoji text for edit button
    await page.locator('button:has-text("✏️")').first().click();
    await page.locator('input.edit-input').fill('Edited todo text');
    await page.locator('button:has-text("💾")').click();

    // Verify edit
    await expect(page.getByText('Edited todo text')).toBeVisible();
    await expect(page.getByText('Todo to edit')).not.toBeVisible();
  });

  test('should cancel todo edit', async ({ page }) => {
    // Add todo first
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('Original todo text');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Start edit and cancel - use emoji text for edit button
    await page.locator('button:has-text("✏️")').first().click();
    await page.locator('input.edit-input').fill('This will be cancelled');
    await page.locator('button:has-text("❌")').click();

    // Verify original text remains
    await expect(page.getByText('Original todo text')).toBeVisible();
    await expect(page.getByText('This will be cancelled')).not.toBeVisible();
  });

  test('should delete todo item', async ({ page }) => {
    // Add todo first
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('Todo to delete');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Verify todo exists
    await expect(page.getByText('Todo to delete')).toBeVisible();

    // Delete todo - use emoji text for delete button
    await page.locator('button:has-text("🗑️")').first().click();

    // Verify deletion
    await expect(page.getByText('Todo to delete')).not.toBeVisible();
    await expect(page.getByText('لا توجد مهام حالياً. أضف مهمة جديدة!')).toBeVisible();
  });
});