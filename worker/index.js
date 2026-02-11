export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    try {
      // Try to serve the static asset from the dist folder
      const asset = await env.ASSETS.fetch(url);
      
      if (asset.status === 404) {
        // For client-side routing, serve index.html for non-asset routes
        const indexUrl = new URL(url);
        indexUrl.pathname = '/index.html';
        return await env.ASSETS.fetch(indexUrl);
      }
      
      return asset;
    } catch (error) {
      return new Response('Error serving asset: ' + error.message, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};
