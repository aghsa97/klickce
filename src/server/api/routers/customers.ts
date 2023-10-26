import { customers, selectCustomerSchema } from "@/server/db/schema/customers";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

export const customersRouter = router({
  getCustomerByClerkId: protectedProcedure.query(async ({ ctx }) => {
    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.clerkUesrId, ctx.auth.userId),
    });

    if (!customer) {
      throw new Error("Customer not found");
    }
    return selectCustomerSchema.parse(customer);
  }),
});
