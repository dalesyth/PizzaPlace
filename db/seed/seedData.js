// import { createUser } from "../users";
const { createUser } = require("../users")
// import { createOrder } from "../orders";
const { createOrder } = require("../orders")
// import {
//   createIngredient,
//   attachIngredientToPizza,
//   attachIngredientToCategory,
// } from "../ingredients";
const { createIngredient, attachIngredientToPizza, attachIngredientToCategory } = require("../ingredients")
// import { createCategory } from "../categories";
const { createCategory } = require("../categories")

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
    console.error("Error creating users: ", error);
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

async function createInitialIngredients() {
  console.log("Starting to create ingredients...");
  try {
    const ingredientsToCreate = [
      {
        title: "Black Olives",
        image_name: "black_olives.jpg",
      },
      {
        title: "Canadian Bacon",
        image_name: "canadian_bacon.jpg",
      },
      {
        title: "Green Olives",
        image_name: "green_olives.jpg",
      },
      {
        title: "Green Peppers",
        image_name: "green_peppers.jpg",
      },
      {
        title: "Ground Beef",
        image_name: "ground_beef.webp",
      },
      {
        title: "Hand-Tossed Crust",
        image_name: "hand_tossed_crust.png",
      },
      {
        title: "Italian Sausage",
        image_name: "italian_sausage.jpg",
      },
      {
        title: "Mushrooms",
        image_name: "mushrooms.webp",
      },
      {
        title: "Pepperoni",
        image_name: "pepperoni.jpg",
      },
      {
        title: "Pineapple",
        image_name: "pineapple.jpg",
      },
      {
        title: "Red Onions",
        image_name: "red_onions.jpg",
      },
      {
        title: "Stuffed Crust",
        image_name: "stuffed_crust.jpeg",
      },
      {
        title: "Thin Crust",
        image_name: "thin_crust.jpg",
      },
    ];

    await Promise.all(ingredientsToCreate.map(createIngredient));
    console.log("Finished creating ingredients!");
  } catch (error) {
    console.error("Error creating ingredients: ", error);
    throw error;
  }
}

async function createInitialPizzaOrders() {
  console.log("Starting to create Pizza Orders...");
  try {
    const pizzaOrdersToCreate = [
      {
        ingredient_id: 2,
        order_id: 1,
        pizza_price: 12.65,
        quantity: 1,
        size: "Medium",
      },
      {
        ingredient_id: 5,
        order_id: 2,
        pizza_price: 13.32,
        size: "Large",
      },
    ];

    await Promise.all(pizzaOrdersToCreate.map(attachIngredientToPizza));
    console.log("Finished creating pizza orders!");
  } catch (error) {
    console.error("Error creating pizza orders: ", error);
    throw error;
  }
}

async function createInitialCategories() {
  console.log("Starting to create categories...");
  try {
    const categoriesToCreate = [
      {
        title: "Toppings",
      },
      {
        title: "Crust",
      },
    ];
  } catch (error) {
    console.error("Error creating categories: ", error);
    throw error;
  }
}

async function populateDB() {
  try {
    await createInitialUsers();
    await createInitialOrders();
    await createInitialIngredients();
    await createInitialPizzaOrders();
    await createInitialCategories();
  } catch (error) {
    console.log("Error during populateDB: ", error);
    throw error;
  }
}

// export { populateDB };

module.exports = { populateDB }