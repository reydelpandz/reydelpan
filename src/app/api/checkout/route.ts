import { prisma } from "@/lib/db";
import { z } from "zod";
import { wilayas } from "@/data/wilayas";

// Define the schema for product items in the order
const orderProductSchema = z.object({
    id: z.number(),
    quantityInCart: z.number().positive(),
});

// Define the main checkout schema
const checkoutSchema = z.object({
    customerFullName: z.string().min(3, {
        message: "Full name must be at least 3 characters",
    }),
    customerPhone: z.string().min(10, {
        message: "Phone number must be at least 10 characters",
    }),
    customerAddress: z.string().min(5, {
        message: "Address must be at least 5 characters",
    }),
    customerWilaya: z.string(),
    customerCommune: z.string(),
    products: z.array(orderProductSchema).min(1, {
        message: "Order must contain at least one product",
    }),
    deliveryMethod: z.enum(["home", "stop-desk"]),
    deliveryCost: z.number().nonnegative(),
    note: z.string().max(300).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = checkoutSchema.parse(body);

        await prisma.$transaction(async (tx) => {
            // Fetch products from database to get current prices and stock
            const productIds = validatedData.products.map(
                (product) => product.id
            );
            const productsFromDb = await tx.product.findMany({
                where: {
                    id: { in: productIds },
                },
            });

            // Verify all products exist and have sufficient stock
            for (const cartProduct of validatedData.products) {
                const dbProduct = productsFromDb.find(
                    (p) => p.id === cartProduct.id
                );

                if (!dbProduct) {
                    throw new Error(
                        `Product with ID ${cartProduct.id} not found`
                    );
                }

                if (dbProduct.quantity < cartProduct.quantityInCart) {
                    throw new Error(
                        `Not enough stock for ${dbProduct.name}. Available: ${dbProduct.quantity}`
                    );
                }
            }

            // Calculate total price
            let productsTotal = 0;
            const orderedProducts = validatedData.products.map(
                (cartProduct) => {
                    const dbProduct = productsFromDb.find(
                        (p) => p.id === cartProduct.id
                    )!;
                    const price = dbProduct.discountedPrice || dbProduct.price;
                    productsTotal += price * cartProduct.quantityInCart;

                    return {
                        name: dbProduct.name,
                        retailPrice: price,
                        quantity: cartProduct.quantityInCart,
                        productId: dbProduct.id,
                    };
                }
            );

            // Add shipping fee
            const selectedWilaya = wilayas.find(
                (w) => w.name === validatedData.customerWilaya
            );

            if (!selectedWilaya) {
                return Response.json(
                    {
                        message:
                            "Couldn't find the selected wilaya in the list of available wilayas",
                    },
                    { status: 400 }
                );
            }

            const deliveryCost =
                selectedWilaya.deliveryFees[validatedData.deliveryMethod];

            // Just a quick way to check if someone tried to deliver to stop desk when it's not enabled
            if (deliveryCost === 0) {
                return Response.json(
                    {
                        message: "Error",
                    },
                    { status: 400 }
                );
            }

            // Create the order in the database
            const order = await tx.order.create({
                data: {
                    customerFullName: validatedData.customerFullName,
                    customerPhone: validatedData.customerPhone,
                    customerAddress: validatedData.customerAddress,
                    customerWilaya: validatedData.customerWilaya,
                    customerCommune: validatedData.customerCommune,
                    customerNote: validatedData.note,
                    deliveryMethod:
                        validatedData.deliveryMethod === "home"
                            ? "HOME"
                            : "STOPDESK",
                    productsTotal,
                    deliveryCost,
                    products: {
                        create: orderedProducts,
                    },
                },
                include: {
                    products: true,
                },
            });

            // Update product quantities
            for (const product of validatedData.products) {
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        quantity: {
                            decrement: product.quantityInCart,
                        },
                    },
                });
            }

            return order;
        });

        return Response.json(
            {
                message: "Order submitted successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Checkout error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    message: "Validation error",
                    errors: error.errors.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                },
                { status: 400 }
            );
        }

        // Handle custom error messages from transaction
        if (error instanceof Error) {
            return Response.json({ message: error.message }, { status: 400 });
        }

        return Response.json(
            { message: "Error creating checkout session" },
            { status: 500 }
        );
    }
}
