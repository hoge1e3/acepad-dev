#!sweval
/*global self*/
async function main(){

self.addUrlHandler('api', event => {
  event.respondWith(handle(event));
});

async function handle(event) {
  const client = await self.clients.get(event.clientId);

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (e) => {
      const { response } = e.data;
      resolve(new Response(response.body, response));
    };

    client.postMessage(
      {
        id: crypto.randomUUID(),
        request: {
          url: event.request.url,
          method: event.request.method
        }
      },
      [channel.port2]
    );
  });
}
  return ;
}
//main();
console.log(9)