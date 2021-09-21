const http = require("http");

const AboutPage = require("./about.js");
const ProjectsPage = require("./projects.js");
const CreateJSON = require("./createjson.js");

const hostname = "localhost";
const port = 3111;

const server = http.createServer((request, response) => {
    // Header options that gets returned to client browser during preflight request
    const headers = {
        "Access-Control-Allow-Origin": "api.ignurof.xyz",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days stored on browser cache TODO: Figure out optimal max-age
        /** add other headers as per requirement */
        "Content-Type": "text/json" // last dont need the comma
      };

      // Before client access site their browser checks for header options
      if (request.method === "OPTIONS") {
        response.writeHead(204, headers);
        response.end();
        return;
      }
      // den var utan !! först och kollade istället > -1,  då funkade den. TODO: ta reda på varför detta inte funkar
      // Not Not False = True, means if GET or POST is available, this is true
      // if(var) = if true, (!var) = if not true, (!!var) == if not not true = true
      if (["GET", "POST"].indexOf(request.method) > -1) {
            response.writeHead(200, headers);
            // OK/SUCCESS response to client here
            let url = request.url;

        // API Routing https://www.example.com?name=n1&name=n2
        if(url == "/about"){
              return AboutPage(response);
        }

        
        if(url == "/projects"){
              return ProjectsPage(response);
        }
        /*
        if(url == "/contact"){
              return ContactPage(response);
        }
        */
        if(url == "/createjson"){
            return CreateJSON(response);
        }
        
            // if no route is chosen or the route does not exist, give this result
            return DefaultPage(response);;
      }

      // The early returns should make sure the client doesnt end up here
      // We end up here if["GET", "POST"].indexOf(request.method)=false meaning there was not a proper request method header
      response.writeHead(405, headers);
      response.end(`${request.method} is not allowed for the request.`);
});

const DefaultPage = (response ) => {
  response.write("Something went wrong with server request, contact admin.");
  response.end();
}

server.listen(port, hostname, (error) => {
    if(error) return console.log(error);

    console.log(`Server running at http://${hostname}:${port}/`);
});


