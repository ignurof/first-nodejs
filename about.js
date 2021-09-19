const http = require("http");
const fs = require("fs");

const port = 3111;

const server = http.createServer((request, response) => {
    // Header options that gets returned to client browser during preflight request
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days stored on browser cache TODO: Figure out optimal max-age
        /** add other headers as per requirement */
        "Content-Type": "text/plain" // last dont need the comma
      };
  
      // Before client access site their browser checks for header options
      if (request.method === "OPTIONS") {
        response.writeHead(204, headers);
        response.end();
        return;
      }

      if (["GET", "POST"].indexOf(request.method) > -1) {
        response.writeHead(200, headers);
        // Read the file
        fs.readFile("about.txt", (error, data) => {
            // 404 error
            if(error) return ErrorPage(response);

            response.write(data);
            // End the response so client recieve it
            response.end();
        }); 
        return;
      }
      
      // The early returns should make sure the client doesnt end up here
      response.writeHead(405, headers);
      response.end(`${request.method} is not allowed for the request.`);
});

// 404 page
const ErrorPage = (response) => {
    response.writeHead(404);
    response.write("Error");
}

server.listen(port, (error) => {
    if(error) return console.log(error);

    console.log("Server listening on port: " + port);
});