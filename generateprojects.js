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

	// Create new file if doesnt exist
	fs.writeFile("projectList.json", inputObject, (errorTwo) => {
		if(errorTwo) return ErrorPage(response);
	});
}

module.exports = GenerateProjectList;