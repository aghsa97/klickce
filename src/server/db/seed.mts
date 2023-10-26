import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import { customers } from "./schema/customers";

async function main() {
  const connection = connect({
    url: process.env.DATABASE_URL,
  });
  const db = drizzle(connection);

  console.log("Seeding database 🌱");

  await db
    .insert(customers)
    .values({
      clerkUesrId: "user_2UR2u3TCG3LExd1fR9ZCq6u27ai",
      email: "mohammed.agha977@gmail.com",
      subPlan: "PRO",
    })
    .execute();
  await db
    .insert(customers)
    .values({
      clerkUesrId: "user_2VkhvobCrl0j7DTf6e8tRxs72QL",
      email: "per@olssonper.se",
      subPlan: "PRO",
    })
    .execute();

  console.log("Done Seeding database ✅ ✨");

  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed ❌");
  console.error(e);
  process.exit(1);
});
