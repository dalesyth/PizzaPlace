import { createUser } from "../users"
import { createOrder } from "../orders";
import { createIngredient, attachIngredientToPizza, attachIngredientToCategory } from "../ingredients";
import { createCategory } from "../categories";

async function createInitialUsers() {
    console.log("Starting to create users...");
    try {
        const usersToCreate = [
            {
                first_name: "Saul",
                last_name: "Goodman",
                password: "IceStationZebra",
                email: "saul.goodman@email.com",
                
            },
            {
                first_name: "Jimmy",
                last_name: "McGill",
                password: "DodgersRock",
                email: "jimmy.mcgill@email.com",
                
            },
            {
                first_name: "Paul",
                last_name: "Thompson",
                password: "footballStar",
                email: "paul.thompson@email.com",
                
            },
            {
                first_name: "Tracy",
                last_name: "Bonham",
                password: "everthingIsFine",
                email: "tracy.bonham@email.com",
                
            },
        ];

        await Promise.all(usersToCreate.map(createUser));

        console.log("Finished creating initial users!");
    } catch (error) {
        console.error("Error creating users: ", error)
        throw error;
    }
}

async function createInitialOrders() {
    console.log("Starting to create Orders...");
    try {
        const ordersToCreate = [
            {
                user_id: 1,
                order_total: 18.75,
                
            },
            {
                user_id: 1,
                order_total: 22.35,
                order_complete: true,
            },
            {
                user_id: 2,
                order_total: 15.65,
            },
            {
                user_id: 3,
                order_total: 16.92,
            },
            {
                user_id: 4,
                order_total: 13.53,
            },
        ];
        await Promise.all(ordersToCreate.map(createOrder));

        console.log("Finished creating initial orders!");
    } catch (error) {
        console.error("Error creating initial orders: ", error);
        throw error;
    }
}