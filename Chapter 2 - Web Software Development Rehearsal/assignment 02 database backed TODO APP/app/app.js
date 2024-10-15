import { z } from './deps.ts'
import { sql } from './deps.ts'

// validator for todo data
const Todo = z.object({
  item: z.string()
})

const idSchema = z.coerce.number();

const handleGetTodo = async (request, urlPatternResult) => {
  console.info(urlPatternResult.pathname.groups.id);
  const id = idSchema.safeParse(urlPatternResult.pathname.groups.id);
  console.info({ id });

  const todos = await sql`SELECT * FROM todos WHERE id = ${id.data}`;

  if (todos.length > 0) {
    return Response.json({ ...todos[0] }, { status: 200 });
  }
  else return Response.json({ error: "Todo not found" }, { status: 404 });

};

const handleGetTodos = async (request) => {
  const todos = await sql`SELECT * FROM todos`;
  return Response.json(todos, { status: 200 });
};

const handlePostTodos = async (request) => {

  const result = Todo.safeParse(await request.json());

  if (result.success) {
    const todo = result.data
    const sqlResult = await sql`INSERT INTO todos (item) VALUES (${todo.item}) RETURNING *`;
    return Response.json(sqlResult[0], { status: 201 });
  }
  else return new Response("Todo creation failed", { status: 400 });
};

// This uses the URLPattern API to create URL pattern matchers.
const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos/:id" }),
    fn: handleGetTodo,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handleGetTodos,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handlePostTodos,
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