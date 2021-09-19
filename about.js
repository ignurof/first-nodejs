const http = require("http");
const fs = require("fs");

const port = 3111;

const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });

    fs.readFile("about.txt", (error, data) => {
        if(error) return ErrorPage(response);

        response.write(data);
        response.end();
    }); 
});

const ErrorPage = (response) => {
    response.writeHead(404);
    response.write("Error");
}

server.listen(port, (error) => {
    if(error) return console.log(error);

    console.log("Server listening on port: " + port);
});