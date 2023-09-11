import { client } from "../index"
import { rebuildDB } from "./rebuildDB";

rebuildDB()
    .catch(console.error)
    .finally(() => client.end())