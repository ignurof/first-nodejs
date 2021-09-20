const fs = require("fs");
const http = require("http");

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
}


module.exports = AboutPage();


