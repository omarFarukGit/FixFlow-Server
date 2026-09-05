import app from "./app";
import { prisma } from "./app/lib/prisma";
import redisClient from "./app/lib/redis";
import {
  seedTesterAdmin,
  seedTesterCustomer,
  seedTesterTechnician,
} from "./app/utils/seed";

const port = process.env.PORT || 5000;
const main = async () => {
  await prisma.$connect();
  console.log(`Connected to the database`);
  await redisClient.connect();
  console.log(`Connected to the Redis database`);
  await seedTesterCustomer();
  await seedTesterAdmin();
  await seedTesterTechnician();

  console.log("Seeding completed successfully!");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
