const fs = require("fs");
const ErrorPage = require("./errors.js");

const CreateJSON = (response) => {
	let testProjects = {
		"id": 1,
		"title": "hej",
		"summary": "sad",
		"content": "asdasd",
		"imageA": "aadasd",
		"imageB": "asdsad",
		"imageC": "adssad",
		"imageD": "assad",
	};

	let inputObject = JSON.stringify(testProjects);

	// Create JSON-file
	fs.writeFile("projects.json", inputObject, (error) => {
		if(error) return ErrorPage(response);
	});

	response.write("Made JSON");
	// End the response so client recieve it
	response.end();
}

module.exports = CreateJSON;