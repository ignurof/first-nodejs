// Reference the HTTP library
const http = require("http");
// Port socket var
const port = 3111;

// This method creates a server and everything related to creation should be here
const server = http.createServer(function(request, response){
    // When client send request to the server, the response writes back a string
    response.write("Hello, World!");
    // End the response so client recieve it
    response.end();
});

// Make the server live by listening on the port specified or print out error
server.listen(port, function(error){
    if(error) return console.log(error);

    console.log("Server listening on port: " + port);
});