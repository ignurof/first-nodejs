const fs = require("fs");
const ErrorPage = require("./errors.js");

const GenerateProjectList = require("./generateprojects.js");

const ProjectsPage = (response) => {
	// Open filestream and try to read the file
	fs.readFile("projectList.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error){
			GenerateProjectList(response);
		}
		// Write the data to the client
		response.write(data);
		// End the response so client recieve it
		response.end();
	});
}


// Exports the method so it can be imported(require) in another file
module.exports = ProjectsPage;