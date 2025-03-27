import EventRepository from "../repositories/EventRepository";
import mongoose from "mongoose";

// Sample event data
const events = [
  {
    name: "Rock Festival 2025",
    type: "FESTIVAL",
    date: new Date("2025-07-15"),
    price: 89.99,
    location: "Paris"
  },
  {
    name: "Classical Music Concert",
    type: "CONCERT",
    date: new Date("2025-05-20"),
    price: 45.50,
    location: "Lyon"
  },
  {
    name: "Comedy Night",
    type: "SPECTACLE",
    date: new Date("2025-04-10"),
    price: 25.00,
    location: "Marseille"
  },
  {
    name: "Jazz Evening",
    type: "CONCERT",
    date: new Date("2025-06-05"),
    price: 35.00,
    location: "Paris"
  },
  {
    name: "Summer Music Festival",
    type: "FESTIVAL",
    date: new Date("2025-08-01"),
    price: 120.00,
    location: "Nice"
  }
];

export async function seedEvents() {
  console.log("🌱 Starting event seeding...");
  
  try {
    for (const event of events) {
      // Check if an event with the same name and date already exists
      const existingEvents = await EventRepository.getEventsByFilter({
        filter: { 
          name: event.name,
          // We can't filter by exact date in the repository, so we'll check after
        }
      });
      
      const eventExists = existingEvents.some(
        existingEvent => 
          existingEvent.date.toISOString().split('T')[0] === 
          event.date.toISOString().split('T')[0]
      );
      
      if (!eventExists) {
        await EventRepository.createEvent({
          payload: {
            name: event.name,
            type: event.type as "CONCERT" | "SPECTACLE" | "FESTIVAL",
            date: event.date,
            price: event.price,
            location: event.location
          }
        });
        
        console.log(`✅ Created event: ${event.name}`);
      } else {
        console.log(`⏩ Event already exists: ${event.name}`);
      }
    }
    
    console.log("✅ Event seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding events:", error);
  }
}

export async function runSeeder() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27018/eventApi");
      console.log("📊 Connected to MongoDB");
    }
    
    await seedEvents();
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("📊 Disconnected from MongoDB");
    }
  } catch (error) {
    console.error("❌ Seeder error:", error);
  }
}

// Allow running directly from command line
if (require.main === module) {
  runSeeder()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
