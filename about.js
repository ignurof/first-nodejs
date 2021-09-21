const fs = require("fs");
const ErrorPage = require("./errors.js");

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

module.exports = AboutPage;