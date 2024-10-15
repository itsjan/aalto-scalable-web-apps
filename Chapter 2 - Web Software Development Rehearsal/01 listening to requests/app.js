const portConfig = { port: 1993 };

const handleRequest = async (request) => {
  return new Response("Hello world!");
};

Deno.serve(portConfig, handleRequest);