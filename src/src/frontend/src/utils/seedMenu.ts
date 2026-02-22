import type { Backend } from "@/backend";
import { SEED_MENU_ITEMS } from "./menuSeedData";

/**
 * Seeds the backend with initial menu items
 * This should be called after admin login
 */
export async function seedMenuItems(backend: Backend) {
  console.log("Starting menu seeding...");
  console.log(`Total items to seed: ${SEED_MENU_ITEMS.length}`);
  
  try {
    // Get current menu items to avoid duplicates
    const existingItems = await backend.getMenuItems();
    console.log(`Existing menu items: ${existingItems.length}`);
    
    if (existingItems.length > 0) {
      console.log("Menu already seeded. Skipping...");
      return {
        success: true,
        message: "Menu already populated",
        itemCount: existingItems.length,
      };
    }
    
    // Add each menu item
    const addedItems: bigint[] = [];
    for (const item of SEED_MENU_ITEMS) {
      try {
        const itemId = await backend.addMenuItem({
          ...item,
          id: 0n, // Will be assigned by backend
        });
        addedItems.push(itemId);
        console.log(`Added: ${item.name} (ID: ${itemId})`);
      } catch (error) {
        console.error(`Failed to add ${item.name}:`, error);
      }
    }
    
    console.log(`Successfully seeded ${addedItems.length} menu items`);
    return {
      success: true,
      message: `Added ${addedItems.length} menu items`,
      itemCount: addedItems.length,
    };
  } catch (error) {
    console.error("Error seeding menu:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      itemCount: 0,
    };
  }
}
