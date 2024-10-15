import {z}  from './deps.ts'

// validator for item data
const Item = z.object ({
    id: z.string(),
    name: z.string()
})

const stringSchema = z.coerce.string();

const items = [
        { id: "2", name: "Item 2" },
        { id: "1", name: "Item 1" },
        { id: "8", name: "Item 8" },
        { id: "3", name: "Item 3" },
        { id: "7", name: "Item 7" },
    ];


const handleGetRoot = async (request) => {
    return new Response("Hello world at root!");
  };
  
  const handleGetItem = async (request, urlPatternResult) => {
    const id = stringSchema.safeParse(urlPatternResult.pathname.groups.id);
    const idx = items.findIndex ((item) => item.id === id.data);
    if (id.success && idx >= 0) {
        return Response.json({  ...items[idx] }, { status: 200 });
    } else return Response.json({ error: "Item not found" }, { status: 404 });
  };
  
  const handleGetItems = async (request) => {
    return Response.json(items);
  };
  
  const handlePostItems = async (request) => {
   const item = await request.json();
   const result = Item.safeParse(item);
   if (result.success) {
        items.push(result.data);
        return new Response("Item created", { status: 201 });
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
    
    // Request object have url and method as string properties
    // The url property can be transformed into a URL object:
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    console.log({ pathname, searchParams });


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