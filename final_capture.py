
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # Ensure the verification directory exists
    output_dir = "/home/jules/verification"
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Set a generous timeout for the entire test
            page.set_default_timeout(60000)

            # Navigate to the game
            await page.goto("http://localhost:3000/Pathfinder-The-Pioneer-Trail")
            print("Page loaded.")

            # Wait for the game canvas to be visible and stable
            canvas = await page.wait_for_selector("canvas", state="visible")
            if not canvas:
                raise Exception("Canvas not found on the page.")
            print("Canvas found.")

            # Give the Title Scene time to load and animate
            await asyncio.sleep(5)

            # --- 1. Capture Title Screen ---
            await page.screenshot(path=f"{output_dir}/01_title_screen.png")
            print("Captured 01_title_screen.png")

            # Click the "Start" button to proceed to Character Select
            # Coordinates are approximate, adjust if necessary
            await page.mouse.click(400, 300)
            print("Clicked 'Start'.")

            # Wait for the Character Select scene to load
            await asyncio.sleep(3)

            # --- 2. Capture Character Select Screen ---
            await page.screenshot(path=f"{output_dir}/02_character_select.png")
            print("Captured 02_character_select.png")

            # Select the male character
            # Coordinates are approximate
            await page.mouse.click(270, 300)
            print("Selected male character.")

            # Wait for the main game scene to load
            await asyncio.sleep(5)

            # --- 3. Capture Dialogue UI ---
            # Press 'E' to interact with the nearest NPC (Samuel)
            await page.keyboard.press("E")
            print("Pressed 'E' to interact.")

            # *** Add a delay to allow the dialogue box to appear ***
            await asyncio.sleep(2)

            await page.screenshot(path=f"{output_dir}/03_dialogue_ui.png")
            print("Captured 03_dialogue_ui.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path=f"{output_dir}/error_screenshot.png")
            print("An error screenshot was taken.")

        finally:
            await browser.close()
            print("Browser closed.")

if __name__ == "__main__":
    asyncio.run(main())
