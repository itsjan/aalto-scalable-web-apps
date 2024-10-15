import { z } from './deps.ts'
import { sql } from './deps.ts'

// validator for item data
const Item = z.object({
  name: z.string()
})

const stringSchema = z.coerce.string();

const handleGetRoot = async (request) => {
  return new Response("Hello world at root!");
};

const handleGetItem = async (request, urlPatternResult) => {
  const id = stringSchema.safeParse(urlPatternResult.pathname.groups.id);

  const items = await sql`SELECT * FROM items WHERE id = ${id}`;

  if (items.length > 0) {
    return Response.json({ ...items[0] }, { status: 200 });
  }
  else return Response.json({ error: "Item not found" }, { status: 404 });

};

const handleGetItems = async (request) => {
  const items = await sql`SELECT * FROM items`;
  return Response.json(items, { status: 200 });
};

const handlePostItems = async (request) => {

  const result = Item.safeParse(await request.json());

  if (result.success) {
    const item = result.data
    const sqlResult = await sql`INSERT INTO items (name) VALUES (${item.name}) RETURNING *`;
    return Response.json(sqlResult[0], { status: 201 });
  }
  else return new Response("Item creation failed", { status: 400 });
};

// This uses the URLPattern API to create URL pattern matchers.
const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/items/:id" }),
    fn: handleGetItem,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/items" }),
    fn: handleGetItems,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/items" }),
    fn: handlePostItems,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleGetRoot,
  },
];

const handleRequest = async (request) => {

  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  return await mapping.fn(request, mappingResult);
};



const portConfig = { port: 1993 };
Deno.serve(portConfig, handleRequest);