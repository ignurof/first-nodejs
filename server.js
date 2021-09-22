const http = require("http");

// Get all module.exports from pages.js
const pages = require("./pages.js");

// IP:PORT
const hostname = "localhost";
const port = 3111;

const server = http.createServer((request, response) => {
    // Header gets return to client during preflight request
    const mainHeaders = {
        // Allow-Origin decides where the request can come from, limited for security purposes
        // Because the frontend is hosted on http://ignurof.xyz and the fetch call gets made there, the origin is this
        // Pretty sure this also catches all subdomains after some testing, so for security there should be specific headers for specific endpoints
        "Access-Control-Allow-Origin": "http://ignurof.xyz",
        // Allow-Methods dictates which reqest the client can send, OPTIONS is for the preflight requests
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days stored on browser cache TODO: Figure out optimal max-age
        /** add other headers as per requirement */
        // Content-Type is what gets parsed in the client browser
        "Content-Type": "text/json" // last dont need the comma
    };

    // Reference url
    let url = request.url;
    // Reference request host (domain name of endpoint)
    let ref = request.headers.host;

    // Endpoint security measure
    if(ref == "api.ignurof.xyz"){
        // Before client access site their browser checks for header options
        // aka preflight request
        if (request.method === "OPTIONS") {
            // Send back statuscode during preflight request and assign the appropriate header values
            response.writeHead(204, mainHeaders);
            // End response so client can recieve data, in this case the preflight options response
            response.end();
            return;
        }

        // TODO: Figure out why I cant do !! instead of > -1
        // Not Not False = True, means if GET or POST is available, this is true
        // if(var) = if true, (!var) = if not true, (!!var) == if not not true = true
        if (["GET", "POST"].indexOf(request.method) > -1) {
            // OK/SUCCESS response to client here
            response.writeHead(200, mainHeaders);

            // API Routing http://api.ignurof.xyz?name=n1&name=n2
            if(url == "/about"){
                return pages.AboutPage(response);
            }
            if(url == "/projects"){
                return pages.ProjectsPage(response);
            }

            // we should not end up here
            return pages.DefaultPage(response);
        } else {
            // We end up here if["GET", "POST"].indexOf(request.method)=false meaning there was not a proper request method header
            response.writeHead(405, mainHeaders);
            response.end(`${request.method} is not allowed for the request.`);
            return;
        }
    }

    // The early returns should make sure the client doesnt end up here
    // we end up here if no proper endpoint
    response.writeHead(405, mainHeaders);
    response.end(`Endpoint is not available right now.`);
});

// Callback function for what is happening on server.listen
server.listen(port, hostname, (error) => {
    if(error) return console.log(error);

    // All console.log prints out on the server console
    console.log(`Server running at http://${hostname}:${port}/`);
});


