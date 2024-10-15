const handleGetRoot = async (request) => {
    return new Response("Hello world at root!");
  };
  
  const handleGetItem = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    return new Response(`Retrieving item with id ${id}`);
  };
  
  const handleGetItems = async (request) => {
    return new Response("Retrieving all items.");
  };
  
  const handlePostItems = async (request) => {
    const body = await request.text();
    const data = JSON.parse(body);
    return new Response(`Posting an item. Data: ${JSON.stringify(data)}`);
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