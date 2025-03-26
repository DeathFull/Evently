import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import mongoose from "mongoose";

// Sample user data
const users = [
  {
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    phone: "+33612345678",
    role: "ADMIN"
  },
  {
    email: "operator@example.com",
    password: "operator123",
    firstName: "Operator",
    lastName: "User",
    phone: "+33623456789",
    role: "OPERATOR"
  },
  {
    email: "user@example.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    phone: "+33634567890",
    role: "USER"
  }
];

export async function seedUsers() {
  console.log("🌱 Starting user seeding...");
  
  try {
    // Hash passwords before creating users
    for (const user of users) {
      const existingUser = await UserRepository.getUserByEmail({ email: user.email });
      
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        await UserRepository.createUser({
          payload: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role as "ADMIN" | "OPERATOR" | "USER"
          }
        });
        
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⏩ User already exists: ${user.email}`);
      }
    }
    
    console.log("✅ User seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
}

// Function to run seeder directly
export async function runSeeder() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/users-api");
      console.log("📊 Connected to MongoDB");
    }
    
    await seedUsers();
    
    // Disconnect if we connected in this function
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
