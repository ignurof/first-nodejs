const fs = require("fs");
const ErrorPage = require("./errors.js");

const ProjectsPage = (response) => {
	// Open filestream and try to read the file
	fs.readFile("projects.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error) return ErrorPage(response); // TODO: Gör så att den istället för ErrorPage skapar filen med korrekt JSON struktur
		// Write the data to the client
		response.write(data);
		// End the response so client recieve it
		response.end();
	});
}

/*
const CreateJSON = (response) => {

	let inputObject = JSON.stringify(manyProjects);

	// Create JSON-file
	fs.writeFile("projects.json", inputObject, (error) => {
		if(error) return ErrorPage(response);
	});

	response.write("Made JSON");
	// End the response so client recieve it
	response.end();
}
*/

let projectList = {
	"projects": []
};

const AddProject = (id, title, summary, content, images) => {
	let project = {
		"id": id,
		"title": title,
		"summary": summary,
		"content": content,
		"images": images
	};

	// Append
	projectList["projects"].push(project);
}

// Exports the method so it can be imported(require) in another file
module.exports = ProjectsPage;