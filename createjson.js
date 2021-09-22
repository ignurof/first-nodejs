// This file is just for testing purposes

const fs = require("fs");
const ErrorPage = require("./errors.js");

const CreateJSON = (response) => {
	let aProject = {
		"id": "test",
		"title": "test",
		"summary": "test",
		"content": "t",
		"images": ["t", "t", "t", "t"]
	};

	let manyProjects = {
		"projects": [
			aProject,
			{
				"id": "test2",
				"title": "test2",
				"summary": "test2",
				"content": "t",
				"images": ["t", "t", "t", "t"]
			}
		]
	};

	let inputObject = JSON.stringify(manyProjects);

	// Create JSON-file
	fs.writeFile("projects.json", inputObject, (error) => {
		if(error) return ErrorPage(response);
	});

	response.write("Made JSON");
	// End the response so client recieve it
	response.end();
}

module.exports = CreateJSON;