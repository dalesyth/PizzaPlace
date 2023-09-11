import { client } from 'pg'

const client = new Client('postgres://localhost:5432/pizza-place');

export { client }