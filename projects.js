const fs = require("fs");
const ErrorPage = require("./errors.js");

const ProjectsPage = (response) => {
  fs.readFile("projects.json", (error, data) => {
	if(error) return ErrorPage(response);

	response.write(data);
	// End the response so client recieve it
	response.end();
  });
}

module.exports = ProjectsPage;