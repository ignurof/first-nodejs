// Import filesystem/filestream lib
const fs = require("fs");

// This is where I store all the projects during server uptime
let projectList = {
	"projects": []
};

// Adds a new project to the list.
const AddProject = (id, title, summary, content, images) => {
	let project = {
		"id": id,
		"title": title,
		"summary": summary,
		"content": content,
		"images": images
	};

	// Append to list
	projectList["projects"].push(project);

	// TODO: Append to file
}

// Return a specific project response
const GetProject = (response, id) => {
	// Declare variable to give back to client later
	let data;

	// Iterate over available projects and when correct one found, print out the entire object
	for(let x = 0; x < projectList.projects.length; x++){
		if(projectList.projects[x].id == id){
			console.log(projectList.projects[x]);
			// convert into JSON string so it can be sent to client
			data = JSON.stringify(projectList.projects[x]);
		}
	}
	
	// Send to client
	response.write(data);
	response.end();
}

// Respond with the projectList
const FillProjectList = () => {
	// Open filestream and try to read the file
	fs.readFile("projectList.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error){
			console.log("read error"); // DEBUG
		}

		// Parse the JSON string into a JSON Object and pass it back into the projectList object
		projectList = JSON.parse(data);
		console.log(projectList);
	});
}

// If the projectList didnt exist, create it and respond with it
const GenerateProjectFile = () => {
	// Add new project to projectList
	AddProject(1, "Jetpack Doggo 1", "C#, Unity", "Text about the game", ["jp1.jpg", "jp2.jpg", "jp3.jpg", "jp4.jpg"]);
	AddProject(2, "Jetpack Doggo 2", "C#, Unity", "Text about the game", ["jp1.jpg", "jp2.jpg", "jp3.jpg", "jp4.jpg"]);
	
	// convert into JSON
	let data = JSON.stringify(projectList);

	console.log(data); // DEBUG

	// Create new file
	fs.writeFile("projectList.json", data, (error) => {
		if(error){
			console.log("write error"); // DEBUG
		}

		console.log("projectList.json created");
	});
}

// Respond with appropriate projects method, but the gist of it is respond with projectList.json
const ProjectsPage = (response) => {
	// Take projectList object and stringify so it can be sent to client
	let data = JSON.stringify(projectList);
	// Send to client
	response.write(data);
	response.end();
}

// Exports the method so it can be imported(require) in another file
module.exports = {
	GetProject,
	FillProjectList,
	GenerateProjectFile,
	ProjectsPage
};