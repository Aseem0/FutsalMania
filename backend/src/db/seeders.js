import { Arena } from "../model/index.js";

/**
 * Seeds the database with initial Futsal Arena data if empty.
 */
export const seedArenas = async () => {
  try {
    // During development, we clear and re-seed to reflect any changes in this file
    await Arena.destroy({ where: {}, truncate: true, cascade: true });
    
    const dummyArenas = [
      {
        name: "Aeron",
        rating: 4.7,
        location: "Baluwatar, Kathmandu",
        distance: "1.2 km away",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
      },
      {
        name: "Field of Dreams",
        rating: 4.5,
        location: "Thasikhel, Lalitpur",
        distance: "2.8 km away",
        image: "https://plus.unsplash.com/premium_photo-1684446464405-71867f88356b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnV0c2FsJTIwZ3JvdW5kc3xlbnwwfHwwfHx8MA%3D%3Dhttps://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
      },
      {
        name: "The Goal Futsal",
        rating: 4.3,
        location: "Maharajgunj, Kathmandu",
        distance: "3.5 km away",
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop"
      },
      {
        name: "Dhuku Futsal Hub",
        rating: 4.8,
        location: "Baluwatar, Kathmandu",
        distance: "0.5 km away",
        image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop"
      },
      {
        name: "Aeron Premium",
        rating: 4.6,
        location: "Baluwatar, Kathmandu",
        distance: "0.5 km away",
        image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop"
      }
    ];

    await Arena.bulkCreate(dummyArenas);
    console.log(`✅ Database synced: Seeded ${dummyArenas.length} arenas.`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};
