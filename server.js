// Reference the HTTP library
const http = require("http");
// FileSystem
const fs = require("fs");
// Port socket var
const port = 3111;

// This method creates a server and everything related to creation should be here
const server = http.createServer((request, response) => {
    // When client send request to the server, the response writes back a string
    //response.write("Hello, World!");

    // Return the response head back to the client, 200 = OK/SUCCESS
    response.writeHead(200, { "Content-Type": "text/html" });

    // Read the index.html and write it to client
    fs.readFile("index.html", (error, data) => {
        // 404 error
        if(error) return ErrorPage();

        response.write(data);
    });

    // End the response so client recieve it
    response.end();
});



// Make the server live by listening on the port specified or print out error
server.listen(port, (error) => {
    if(error) return console.log(error);

    console.log("Server listening on port: " + port);
});