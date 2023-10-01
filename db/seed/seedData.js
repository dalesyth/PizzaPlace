const { createUser } = require("../users");
const { createOrder, attachPizzaToOrder } = require("../orders");
const { createTopping, attachToppingToOrderedPizza } = require("../toppings");
const { createCrust } = require("../crusts");
const { createSauce } = require("../sauces");


async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        first_name: "Saul",
        last_name: "Goodman",
        password: "IceStationZebra",
        email: "saul.goodman@email.com",
        phone: 5552319876,
        is_admin: false,
      },
      {
        first_name: "Jimmy",
        last_name: "McGill",
        password: "DodgersRock",
        email: "jimmy.mcgill@email.com",
        phone: 5551123465,
        is_admin: false,
      },
      {
        first_name: "Paul",
        last_name: "Thompson",
        password: "footballStar",
        email: "paul.thompson@email.com",
        phone: 5559007124,
        is_admin: false,
      },
      {
        first_name: "Tracy",
        last_name: "Bonham",
        password: "everthingIsFine",
        email: "tracy.bonham@email.com",
        phone: 5556667788,
        is_admin: false,
      },
      {
        first_name: "Dale",
        last_name: "Syth",
        password: "notonyourlife",
        email: "dalesyth@gmail.com",
        phone: 4054641317,
        is_admin: true,
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
        order_date: "2023-07-12",
        order_total: 18.75,
        order_complete: true,
      },
      {
        user_id: 1,
        order_date: "2023-08-17",
        order_total: 22.35,
        order_complete: true,
      },
      {
        user_id: 2,
        order_date: "2023-09-04",
        order_total: 15.65,
        order_complete: true,
      },
      {
        user_id: 3,
        order_date: "2023-10-01",
        order_total: 16.92,
        order_complete: false,
      },
      {
        user_id: 4,
        order_date: "2023-10-01",
        order_total: 13.53,
        order_complete: false,
      },
    ];
    await Promise.all(ordersToCreate.map(createOrder));

    console.log("Finished creating initial orders!");
  } catch (error) {
    console.error("Error creating initial orders: ", error);
    throw error;
  }
}

async function createInitialToppings() {
  console.log("Starting to create toppings...");
  try {
    const toppingsToCreate = [
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
    ];

    await Promise.all(toppingsToCreate.map(createTopping));
    console.log("Finished creating toppings!");
  } catch (error) {
    console.error("Error creating toppings: ", error);
    throw error;
  }
}

async function createInitialCrusts() {
  console.log("Starting to create crusts...");
  try {
    const crustsToCreate = [
      {
        title: "Original Hand-Tossed",
        image_name: "hand_tossed_crust.png",
      },
      {
        title: "Stuffed Crust",
        image_name: "stuffed_crust.jpeg",
      },
      {
        title: "Thin Crust",
        image_name: "thin_crust.jpeg",
      },
    ];

    await Promise.all(crustsToCreate.map(createCrust));
    console.log("Finished creating crusts!");
  } catch (error) {
    console.error("Error creating crusts: ", error);
    throw error;
  }
}

async function createInitialSauces() {
  console.log("Starting to create sauces...");
  try {
    const saucesToCreate = [
      {
        title: "Marinara Sauce",
      },
      {
        title: "Alfredo Sauce",
      },
      {
        title: "BBQ Sauce",
      },
    ];

    await Promise.all(saucesToCreate.map(createSauce));
    console.log("Finished creating sauces!");
  } catch (error) {
    console.error("Error creating sauces: ", error);
    throw error;
  }
}

async function createInitialOrderedPizzas() {
  console.log("Starting to create Ordered Pizzas...");
  try {
    const orderedPizzasToCreate = [
      {
        order_id: 1,
        pizza_price: 18.75,
        quantity: 1,
        size: "large",
        crust: 1,
        sauce: 1,
      },
      {
        order_id: 2,
        pizza_price: 22.35,
        quantity: 2,
        size: "small",
        crust: 3,
        sauce: 2,
      },
      {
        order_id: 3,
        pizza_price: 15.65,
        quantity: 1,
        size: "medium",
        crust: 2,
        sauce: 3,
      },
      {
        order_id: 4,
        pizza_price: 16.92,
        quantity: 1,
        size: "large",
        crust: 1,
        sauce: 1,
      },
      {
        order_id: 5,
        pizza_price: 13.53,
        quantity: 1,
        size: "small",
        crust: 2,
        sauce: 1,
      },
    ];

    await Promise.all(orderedPizzasToCreate.map(attachPizzaToOrder));
    console.log("Finished creating Ordered Pizzas!");
  } catch (error) {
    console.error("Error creating Ordered Pizzas: ", error);
    throw error;
  }
}

async function createInitialPizzaToppings() {
  console.log("Starting to create Pizza Toppings...");
  try {
    const pizzaToppingsToCreate = [
      {
        topping_id: 8,
        pizza_id: 1,
      },
      {
        topping_id: 7,
        pizza_id: 2,
      },
      {
        topping_id: 10,
        pizza_id: 2,
      },
      {
        topping_id: 5,
        pizza_id: 3,
      },
      {
        topping_id: 2,
        pizza_id: 4,
      }
      {
        topping_id: 7,
        pizza_id: 5,
      }
    ];

    await Promise.all(pizzaToppingsToCreate.map(attachToppingToOrderedPizza));
    console.log("Finished creating Pizza Toppings!");
  } catch (error) {
    console.error("Error creating Pizza Toppings: ", error);
    throw error;
  }
}

async function populateDB() {
  try {
    await createInitialUsers();
    await createInitialOrders();
    await createInitialToppings();
    await createInitialCrusts();
    await createInitialSauces();
    await createInitialOrderedPizzas();
    await createInitialCategories();
  } catch (error) {
    console.log("Error during populateDB: ", error);
    throw error;
  }
}

module.exports = { populateDB };
