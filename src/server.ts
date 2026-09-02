import app from "./app";
import { prisma } from "./app/lib/prisma";

const port = process.env.PORT || 5000;
const main = async () => {
  await prisma.$connect();
  console.log(`Connected to the database`);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
