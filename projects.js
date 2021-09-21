const fs = require("fs");
const ErrorPage = require("./errors.js");

const ProjectsPage = (response) => {
	// Open filestream and try to read the file
	fs.readFile("projects.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error) return ErrorPage(response);
		// Write the data to the client
		response.write(data);
		// End the response so client recieve it
		response.end();
	});
}

// Exports the method so it can be imported(require) in another file
module.exports = ProjectsPage;