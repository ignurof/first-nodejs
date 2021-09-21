const http = require("http");

const pages = require("./pages.js");

const hostname = "localhost";
const port = 3111;

const server = http.createServer((request, response) => {
    // Header gets return to client during preflight request
    const headers = {
        // Allow-Origin decides where the request can come from, limited for security purposes
        "Access-Control-Allow-Origin": "api.ignurof.xyz",
        // Allow-Methods dictates which reqest the client can send, OPTIONS is for the preflight requests
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days stored on browser cache TODO: Figure out optimal max-age
        /** add other headers as per requirement */
        // Content-Type is what gets parsed in the client browser
        "Content-Type": "text/json" // last dont need the comma
    };

    // Before client access site their browser checks for header options
    // aka preflight request
    if (request.method === "OPTIONS") {
        // Send back statuscode during preflight request and assign the appropriate header values
        response.writeHead(204, headers);
        // End response so client can recieve data, in this case the preflight options response
        response.end();
        return;
    }

    // TODO: Figure out why I cant do !! instead of > -1
    // Not Not False = True, means if GET or POST is available, this is true
    // if(var) = if true, (!var) = if not true, (!!var) == if not not true = true
    if (["GET", "POST"].indexOf(request.method) > -1) {
        response.writeHead(200, headers);
        // OK/SUCCESS response to client here
        let url = request.url;

        let ref = request.headers.host;

        // Test endpoint security by not allowing other endpoints
        if(!ref == "api.ignurof.xyz"){
            return pages.DefaultPage(response);
        }

        // API Routing http://api.ignurof.xyz?name=n1&name=n2
        if(url == "/about"){
            return pages.AboutPage(response);
        }
        if(url == "/projects"){
            return pages.ProjectsPage(response);
        }

        // if no route is chosen or the route does not exist, give this result
        return pages.DefaultPage(response);;
    }

    // The early returns should make sure the client doesnt end up here
    // We end up here if["GET", "POST"].indexOf(request.method)=false meaning there was not a proper request method header
    response.writeHead(405, headers);
    response.end(`${request.method} is not allowed for the request.`);
});

// Callback function for what is happening on server.listen
server.listen(port, hostname, (error) => {
    if(error) return console.log(error);

    console.log(`Server running at http://${hostname}:${port}/`);
});


