//local lib
const errorMessage = require("./errors");

export const AboutPage = (response) => {
  // Read the file
  fs.readFile("about.txt", (error, data) => {
    // 404 error
    if(error) return errorMessage.ErrorPage(response);

    response.write(data);
    // End the response so client recieve it
    response.end();
  }); 
}


