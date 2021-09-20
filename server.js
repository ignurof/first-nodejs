const http = require("http");
const fs = require("fs");

const hostname = "localhost";
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
        // OK/SUCCESS response to client here
        var url = request.url;

        if(url == "/about"){
          return AboutPage(response);
        }

        // if main root path
        return AboutPage(response);;
      }
      
      // The early returns should make sure the client doesnt end up here
      response.writeHead(405, headers);
      response.end(`${request.method} is not allowed for the request.`);
});

const AboutPage = (response) => {
  // Read the file
  fs.readFile("about.txt", (error, data) => {
    // 404 error
    if(error) return ErrorPage(response);

    response.write(data);
    // End the response so client recieve it
    response.end();
  }); 
}

// 404 page
const ErrorPage = (response) => {
  response.writeHead(404);
  response.write("Error");
  // End the response so client recieve it
  response.end();
}

server.listen(port, hostname, (error) => {
    if(error) return console.log(error);

    console.log(`Server running at http://${hostname}:${port}/`);
});


