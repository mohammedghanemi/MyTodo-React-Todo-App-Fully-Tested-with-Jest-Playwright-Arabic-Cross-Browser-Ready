const { test, expect } = require('@playwright/test');

test.describe('Complete Todo Workflow', () => {
  test('complete user journey with multiple operations', async ({ page }) => {
    // Step 1: Login
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('workflowuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    await expect(page.getByText('مرحباً، workflowuser')).toBeVisible();

    // Step 2: Add multiple todos
    const todos = ['Buy groceries', 'Walk the dog', 'Finish report'];
    
    for (const todo of todos) {
      await page.getByPlaceholder('أضف مهمة جديدة...').fill(todo);
      await page.getByRole('button', { name: 'إضافة' }).click();
      await expect(page.getByText(todo)).toBeVisible();
    }

    // Verify all todos are added
    await expect(page.getByText('المهام المكتملة: 0/3')).toBeVisible();

    // Step 3: Complete some todos
    const checkboxes = await page.getByRole('checkbox').all();
    await checkboxes[0].click(); // Complete first todo
    await checkboxes[2].click(); // Complete third todo

    await expect(page.getByText('المهام المكتملة: 2/3')).toBeVisible();

    // Step 4: Edit a todo - use emoji text
    const editButtons = await page.locator('button:has-text("✏️")').all();
    await editButtons[1].click(); // Edit second todo
    
    await page.locator('input.edit-input').fill('Walk the cat instead');
    await page.locator('button:has-text("💾")').click();

    await expect(page.getByText('Walk the cat instead')).toBeVisible();

    // Step 5: Delete a todo - use emoji text
    const deleteButtons = await page.locator('button:has-text("🗑️")').all();
    await deleteButtons[0].click(); // Delete first todo

    await expect(page.getByText('Buy groceries')).not.toBeVisible();
    await expect(page.getByText('المهام المكتملة: 1/2')).toBeVisible();

    // Step 6: Logout and verify data persistence
    await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();

    // Step 7: Login again and verify todos are still there
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('workflowuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    await expect(page.getByText('مرحباً، workflowuser')).toBeVisible();
    await expect(page.getByText('Walk the cat instead')).toBeVisible();
    await expect(page.getByText('Finish report')).toBeVisible();
    await expect(page.getByText('المهام المكتملة: 1/2')).toBeVisible();
  });

  test('double-click to edit todo', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('أدخل اسم المستخدم').fill('testuser');
    await page.getByPlaceholder('أدخل كلمة المرور').fill('password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Add todo
    await page.getByPlaceholder('أضف مهمة جديدة...').fill('Double click test');
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Double click to edit
    await page.getByText('Double click test').dblclick();

    // Edit and save
    await page.locator('input.edit-input').fill('Edited by double click');
    await page.locator('button:has-text("💾")').click();

    await expect(page.getByText('Edited by double click')).toBeVisible();
  });

  test('keyboard navigation in todo app', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Login using keyboard
    await page.getByPlaceholder('أدخل اسم المستخدم').focus();
    await page.keyboard.type('keyboarduser');
    await page.keyboard.press('Tab');
    await page.keyboard.type('password');
    await page.keyboard.press('Enter');

    await expect(page.getByText('مرحباً، keyboarduser')).toBeVisible();

    // Add todo using keyboard
    await page.getByPlaceholder('أضف مهمة جديدة...').focus();
    await page.keyboard.type('Keyboard added todo');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Keyboard added todo')).toBeVisible();
  });
});