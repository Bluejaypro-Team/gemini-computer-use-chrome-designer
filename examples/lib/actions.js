/**
 * Action Executor module.
 * Depends on: NOTHING — pure function that receives the Playwright page via parameter.
 * This is a fully isolated, independently testable module.
 */

/**
 * Dispatches a Playwright mouse/keyboard action based on the decision object
 * returned by the decision engine. Uses an action dictionary to eliminate
 * nested if/else branching.
 *
 * @param {import('playwright').Page} page
 * @param {{action: string, x?: number, y?: number, text?: string, endX?: number, endY?: number}} decision
 * @returns {Promise<boolean>} true if the action executed successfully
 */
export async function executeAction(page, decision) {
  const { action, x, y, text, endX, endY } = decision;

  const actionHandlers = {
    click: async () => {
      console.log(`Clicking at [x: ${x}, y: ${y}]`);
      await page.mouse.click(x, y);
    },
    drag: async () => {
      console.log(`Dragging from [x: ${x}, y: ${y}] to [x: ${endX}, y: ${endY}]`);
      await page.mouse.move(x, y);
      await page.mouse.down();
      // Move in multiple small steps to simulate natural drag-and-drop mechanics
      await page.mouse.move(endX, endY, { steps: 10 });
      await page.mouse.up();
    },
    type: async () => {
      console.log(`Clicking and typing "${text}" at [x: ${x}, y: ${y}]`);
      await page.mouse.click(x, y);
      await page.keyboard.type(text);
    },
    wait: async () => {
      console.log('Waiting 2 seconds...');
      await page.waitForTimeout(2000);
    }
  };

  const handler = actionHandlers[action];
  if (!handler) {
    console.error(`Unknown action type: "${action}"`);
    return false;
  }

  try {
    await handler();
    return true;
  } catch (error) {
    console.error(`Failed to execute action ${action}:`, error.message);
    return false;
  }
}
