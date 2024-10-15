//app.js

const todos = [{ item: "todo item" }];

const handleGetTodos = async (req) => {
  return Response.json(todos);
};

const handlePostTodos = async (req) => {
  try {
    const newTodo = await req.json();
    todos.push(newTodo);
    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("ERROR", { status: 400 });
  }
};

const urlMap = [
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
  const mapping = urlMap.find(
    (um) => um.method === request.method && um.pattern.test(request.url),
  );
  return mapping
    ? await mapping.fn(request)
    : new Response("Not found", { status: 404 });
};

Deno.serve({ port: 7777 }, handleRequest);