const http = require("http");
const url = require('url');

// Get all module.exports from pages.js
const pages = require("./pages.js");
// Consolidate projects related in projects
const projects = require("./projects.js");
const ValidateProjects = require("./startup.js");

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
    if(ref == "localhost:3111"){
        // Before client access site their browser checks for header options
        // aka preflight request
        if (request.method === "OPTIONS") {
            // Send back statuscode during preflight request and assign the appropriate header values
            response.writeHead(204, publicHeaders);
            // End response so client can recieve data, in this case the preflight options response
            response.end();
            return;
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

            // TODO: testa så detta fungerar som routing 
            switch(urlStringArray[1]){
                case "about": return pages.AboutPage(response);
                case "projects": return projects.ProjectsPage(response);
                case "project":
                    // Check further params if user wants to add, edit or delete ( SHOULD BE IN PRIVATE ENDPOINT )
                    switch(urlStringArray[2]){
                        // /project/add/title/summary/content/imagea/imageb/imagec/imaged
                        case "add": return projects.AddProject(
                            urlStringArray[3], // title
                            urlStringArray[4], // summary
                            urlStringArray[5], // content
                            [urlStringArray[6], urlStringArray[7], urlStringArray[8], urlStringArray[9]] // images
                        );
                        // /project/edit/id/title/summary/content/imagea/imageb/imagec/imaged
                        case "edit": return projects.EditProject(
                            urlStringArray[3], // id
                            urlStringArray[4], // title
                            urlStringArray[5], // summary
                            urlStringArray[6], // content
                            [urlStringArray[7], urlStringArray[8], urlStringArray[9], urlStringArray[10]] // images
                        );
                        case "delete": return projects.DeleteProject(urlStringArray[3]);
                        
                        // Should not end up here
                        default: return pages.DefaultPage(response);
                    }
                
                // Should not end up here either
                default: return pages.DefaultPage(response);
            } // ROUTING END
        } else {
            // We end up here if["GET", "POST"].indexOf(request.method)=false meaning there was not a proper request method header
            response.writeHead(405, publicHeaders);
            response.end(`${request.method} is not allowed for the request.`);
            return;
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
            response.end();
            // leave the thing completely after recieving options so client can recieve proper page
            return; 
        }

        // Check available request method
        if (["GET", "POST"].indexOf(request.method) > -1) {
            response.writeHead(200, privateHeaders);

            // Create a new URL object that takes a full url string
            let currentURL = new URL("http://" + ref + requestURL);
            // Debug
            console.log(currentURL.href);
            // Search for the query params
            let urlParams = currentURL.searchParams;
            // Get specific params
            let projID = urlParams.get("projectid");
            let projTITLE = urlParams.get("title");
            let projSUMMARY = urlParams.get("summary");
            let projCONTENT = urlParams.get("content");
            let projIMAGEA = urlParams.get("imagea");
            let projIMAGEB = urlParams.get("imageb");
            let projIMAGEC = urlParams.get("imagec");
            let projIMAGED = urlParams.get("imaged");
            // Debug
            console.log(projID);
            console.log(requestURL);
            console.log("here");

            // TODO: Find a more reasonable way of getting values for creation of projects
            // API Routing http://private.ignurof.xyz?projectid=1&title=hej&summary=text&content=text&imagea=path&imageb=path&imagec=path&imaged=path
            if(requestURL.startsWith("/deleteproject?projectid")){
                projects.DeleteProject(projID);
                response.write("Deleted project with id: " + projID);
                response.end();
                return; // Need to early return here so we dont end up on defaultpage/endpoint error page
            }
            if(requestURL.startsWith("/addproject?title")){
                projects.AddProject(projTITLE, projSUMMARY, projCONTENT, projIMAGEA, projIMAGEB, projIMAGEC, projIMAGED);
                response.write("Created project with title:" + projTITLE);
                response.end();
                return;
            }

            return pages.DefaultPage(response);
        } else {
            response.writeHead(405, privateHeaders);
            response.end(`${request.method} is not allowed for the request.`);
            return;
        }
    }

    // The early returns should make sure the client doesnt end up here
    // we end up here if no proper endpoint
    response.writeHead(405, publicHeaders);
    response.end(`Endpoint is not available right now.`);
});

// Callback function for what is happening on server.listen (Startup?)
server.listen(port, hostname, (error) => {
    if(error) return console.log(error);

    // All console.log prints out on the server console
    console.log(`Server running at http://${hostname}:${port}/`);

    // Server startup validation
    // Make sure required files exist, if not, create them
    ValidateProjects();
});


