const { test, expect } = require('@playwright/test');

// Mock TestReporter for Playwright environment
class TestReporter {
  static async takeScreenshot(page, testName) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `test-results/screenshots/${testName}-${timestamp}.png`;
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }
}

test.describe('Todo App Enhanced Tests with Reporting', () => {
  test('should add todo item with screenshot evidence', async ({ page }) => {
    const testStartTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    // Take initial screenshot
    await TestReporter.takeScreenshot(page, 'todo-app-initial');
    
    // Add todo item
    await page.fill('[data-testid="todo-input"]', 'Buy groceries');
    await page.click('[data-testid="add-button"]');
    
    // Verify todo was added
    await expect(page.locator('[data-testid="todo-item"]').first()).toHaveText('Buy groceries');
    
    // Take success screenshot
    await TestReporter.takeScreenshot(page, 'todo-added-success');
    
    const duration = Date.now() - testStartTime;
    console.log(`✅ Test "Add Todo" completed in ${duration}ms`);
  });

  test('should complete todo item with visual proof', async ({ page }) => {
    const testStartTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    // Add a todo first
    await page.fill('[data-testid="todo-input"]', 'Complete this task');
    await page.click('[data-testid="add-button"]');
    
    // Complete the todo
    await page.click('[data-testid="complete-button"]').first();
    
    // Verify completion with visual evidence
    await expect(page.locator('[data-testid="todo-item"].completed').first()).toBeVisible();
    await TestReporter.takeScreenshot(page, 'todo-completed');
    
    const duration = Date.now() - testStartTime;
    console.log(`✅ Test "Complete Todo" completed in ${duration}ms`);
  });

  test('should handle todo deletion with error reporting', async ({ page }) => {
    const testStartTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    try {
      // Try to delete without adding todo first (should show error)
      await page.click('[data-testid="delete-button"]').first().catch(() => {});
      
      // Add a todo properly
      await page.fill('[data-testid="todo-input"]', 'Task to delete');
      await page.click('[data-testid="add-button"]');
      
      // Delete the todo
      await page.click('[data-testid="delete-button"]').first();
      
      // Verify deletion
      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
      await TestReporter.takeScreenshot(page, 'todo-deleted');
      
      const duration = Date.now() - testStartTime;
      console.log(`✅ Test "Delete Todo" completed in ${duration}ms`);
      
    } catch (error) {
      // Capture failure evidence
      await TestReporter.takeScreenshot(page, 'todo-deletion-failed');
      console.error(`❌ Test "Delete Todo" failed:`, error);
      throw error;
    }
  });

  test('should filter todos with comprehensive reporting', async ({ page }) => {
    const testStartTime = Date.now();
    
    await page.goto('http://localhost:3000');
    
    // Add multiple todos
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    for (const todo of todos) {
      await page.fill('[data-testid="todo-input"]', todo);
      await page.click('[data-testid="add-button"]');
      await page.waitForTimeout(100);
    }
    
    // Complete first task
    await page.click('[data-testid="complete-button"]').first();
    
    // Test filter functionality
    await page.click('[data-testid="filter-active"]');
    await TestReporter.takeScreenshot(page, 'active-todos-filter');
    
    await page.click('[data-testid="filter-completed"]');
    await TestReporter.takeScreenshot(page, 'completed-todos-filter');
    
    await page.click('[data-testid="filter-all"]');
    await TestReporter.takeScreenshot(page, 'all-todos-filter');
    
    const duration = Date.now() - testStartTime;
    console.log(`✅ Test "Filter Todos" completed in ${duration}ms`);
  });
});