const http = require("http");

// Get all module.exports from pages.js
const DefaultPage = require("./pages.js");
// Consolidate projects related in projects
const projects = require("./projects.js");
const ValidateProjects = require("./startup.js");
const about = require("./about.js");

// IP:PORT
const hostname = "localhost";
const port = 3111;

const server = http.createServer((request, response) => {
    // Header gets return to client during preflight request
    const publicHeaders = {
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

    const privateHeaders = {
        // Have now confirmed that you cannot make fetch calls to this endpoint from a different domain
        // But hacker could still send the request to the correct api url
        // This means that server has to verify every request to make sure authkey is present
        "Access-Control-Allow-Origin": "http://admin.ignurof.xyz",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, 
        "Content-Type": "text/json"
    };

    // Reference url
    let requestURL = request.url;
    // Reference request host (domain name of endpoint)
    let ref = request.headers.host;

    // Endpoint security measure - PUBLIC API
    if(ref == "api.ignurof.xyz"){
        // Before client access site their browser checks for header options
        // aka preflight request
        if (request.method === "OPTIONS") {
            // Send back statuscode during preflight request and assign the appropriate header values
            response.writeHead(204, publicHeaders);
            // End response so client can recieve data, in this case the preflight options response
            return response.end();;
        }

        // TODO: Figure out why I cant do !! instead of > -1
        // Not Not False = True, means if GET or POST is available, this is true
        // if(var) = if true, (!var) = if not true, (!!var) == if not not true = true
        if (["GET", "POST"].indexOf(request.method) > -1) {
            // OK/SUCCESS response to client here
            response.writeHead(200, publicHeaders);

            /*  
                Reference the entire url as an array, split up by the character
                first index is empty because nothing comes before the first / in the href
            */  
            let urlStringArray = requestURL.split("/");

            // Check the url params
            switch(urlStringArray[1]){
                case "about": return about.AboutPage(response);
                case "projects": return projects.ProjectsPage(response);
                case "project":
                    // If no routing character is present or if not routing argument, aka /project or /project/
                    if(urlStringArray[2] == null || urlStringArray[2] == "") return response.end("Error empty");

                    let errorObj = { "error": 0 };
                    // I need to turn Object into String to send it
                    let errorMsg = JSON.stringify(errorObj);

                    // If the projectid from frontend is out of bounds I return errorMsg that frontend can use to redirect user
                    if(urlStringArray[2] < 1 || urlStringArray[2] > projects.ProjectsLength()) return response.end(errorMsg);

                    // If argument is available and all is OK, do this                    
                    return response.end(projects.GetProject(urlStringArray[2]));;
                    
                // Should not end up here either
                default: return DefaultPage(response);
            } // ROUTING END
        } else {
            // We end up here if["GET", "POST"].indexOf(request.method)=false meaning there was not a proper request method header
            response.writeHead(405, publicHeaders);
            return response.end(`${request.method} is not allowed for the request.`);
        }
    }

    // Endpoint security measure - PRIVATE API (admin stuff)
    // TODO: Need to make frontend admin.ignurof.xyz require auth
    // Hardcoded admin password created with encryption
    // When admin logs in with regular password on frontend
    // Check the password against the encrypted pw with private key
    // If successfull, authorize the request here on server, otherwise deny and show deny message
    if(ref == "private.ignurof.xyz"){
        // Preflight
        if(request.method == "OPTIONS"){
            response.writeHead(204, privateHeaders);
            // leave the thing completely after recieving options so client can recieve proper page
            return response.end();
        }

        // Check available request method
        if (["GET", "POST"].indexOf(request.method) > -1) {
            response.writeHead(200, privateHeaders);

            /*  
                Reference the entire url as an array, split up by the character
                first index is empty because nothing comes before the first / in the href
            */  
            let urlStringArray = requestURL.split("/");

            // Check the url params
            switch(urlStringArray[1]){
                case "about":
                    // Usage: /about/stringcontenthere
                    // If no routing character is present or if not routing argument, aka /about or /about/
                    if(urlStringArray[2] == null || urlStringArray[2] == "") return response.end("Error empty");
                    switch(urlStringArray[2]){
                        case urlStringArray[2]:
                            about.EditAboutContent(urlStringArray[2]);
                            response.write("Edited about");
                            response.end();
                            return;
                    }
                    
                // Should not end up here either
                default: return DefaultPage(response);
            } // ROUTING END
        } else {
            response.writeHead(405, privateHeaders);
            return response.end(`${request.method} is not allowed for the request.`);
        }
    }

    // The early returns should make sure the client doesnt end up here
    // we end up here if no proper endpoint and really should not end up here
    response.writeHead(405, publicHeaders);
    response.end(`Endpoint is not available right now.`);
});

// Callback function for what is happening on server.listen (Startup?)
server.listen(port, hostname, (error) => {
    if(error) return console.error(error);

    // All console.log prints out on the server console
    console.log(`Server running at http://${hostname}:${port}/`);

    // Server startup validation
    // Make sure required files exist, if not, create them
    ValidateProjects();
});
