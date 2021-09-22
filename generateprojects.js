const fs = require("fs");

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

const GenerateProjectList = (response) => {
	// Add new project to projectList
	AddProject("1", "Jetpack Doggo 1", "C#, Unity", "Text about the game", ["jp1.jpg", "jp2.jpg", "jp3.jpg", "jp4.jpg"]);
	console.log(projectList);
	// Convert object to string so we can use it in fs
	let inputObject = JSON.stringify(projectList);

	// TODO FOR THE MORNING: Make it so it wont do this if the file already exists, and make it in projects.js so that if that doesnt exist then use this method
	// Make all page method more modular by putting response in the routing area instead, maybe just end so I can pass data through the response with the methods
	// Create new file
	fs.writeFile("projectList.json", inputObject, (error) => {
		if(error) return ErrorPage(response);
	});

	// Write the data to the client
	response.write("Generated Projects List");
	// End the response so client recieve it
	response.end();
}

module.exports = GenerateProjectList;