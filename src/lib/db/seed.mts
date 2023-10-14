import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import { customers } from "./schema/customers";
import { images } from "./schema/images";
import { maps } from "./schema/maps";
import { projects } from "./schema/projects";
import { spots } from "./schema/spots";

async function main() {
  const DEVconnection = connect({
    url: process.env.DATABASE_URL,
  });
  const db = drizzle(DEVconnection);

  console.log("Seeding database 🌱");

  console.log("Done Seeding database ✅ ✨");

  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed ❌");
  console.error(e);
  process.exit(1);
});
