import { dropTables, createTables } from './dbtables';

async function rebuildDB() {
    try {
        await dropTables();
        await createTables();
    } catch (error) {
        console.log("Error during rebuildDB");
        throw error;
    }
}

export { rebuildDB }