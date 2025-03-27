import { runSeeder } from "../utils/seeder";

runSeeder()
  .then(() => {
    console.log("Event seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Event seeding failed:", error);
    process.exit(1);
  });
