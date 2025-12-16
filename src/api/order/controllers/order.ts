import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        // Get validated key from middleware (no need to check again)
        const key = ctx.state.idempotencyKey;
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("User not authenticated");
        }

        // Check if order with this key already exists for THIS user
        const existing = await strapi.db.query("api::order.order").findOne({
          where: {
            idempotencyKey: key,
            users_permissions_user: user.id,
          },
          populate: {
            users_permissions_user: true,
            address: true,
            order_items: true,
            discount: true,
          },
        });

        if (existing) {
          return ctx.send({
            data: existing,
            meta: { idempotent: true },
          });
        }

        // Destructure request data
        const {
          total_amount,
          payment_method,
          order_status,
          address,
          order_items,
          discount,
          users_permissions_user: requestedUserId,
        } = ctx.request.body.data;

        // Determine if user can set custom user_id (admin only)
        let orderUserId = user.id;

        if (requestedUserId && requestedUserId !== user.id) {
          // Check if user is admin
          const userWithRole = (await strapi.entityService.findOne(
            "plugin::users-permissions.user",
            user.id,
            { populate: ["role"] }
          )) as any;

          if (userWithRole?.role?.type === "administrator") {
            orderUserId = requestedUserId;
          } else {
            return ctx.forbidden(
              "Only administrators can create orders for other users"
            );
          }
        }

        // Prepare order data
        const orderData: any = {
          total_amount,
          payment_method,
          order_status,
          idempotencyKey: key,
          users_permissions_user: orderUserId,
        };

        // Add optional relations
        if (address) orderData.address = address;
        if (order_items?.length > 0) orderData.order_items = order_items;
        if (discount) orderData.discount = discount;

        // Create the order
        const newOrder = await strapi.entityService.create("api::order.order", {
          data: orderData,
          populate: {
            users_permissions_user: true,
            address: true,
            order_items: true,
            discount: true,
          },
        });

        return ctx.send({
          data: newOrder,
          meta: { idempotent: false },
        });
      } catch (err) {
        strapi.log.error("Order creation failed:", err);

        // Return more specific error messages
        if (err.message.includes("violates foreign key constraint")) {
          return ctx.badRequest("Invalid address, order_items, or discount ID");
        }

        if (err.message.includes("duplicate key")) {
          return ctx.conflict("Order with this idempotency key already exists");
        }

        return ctx.badRequest(err.message || "Failed to create order");
      }
    },
  })
);
