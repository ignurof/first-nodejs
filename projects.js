const fs = require("fs");

let projectList = {
	"projects": []
};

// Adds a new project to the list. TODO: Make it so it appends to the actual file
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

// TODO: Gör så att det finns en id parameter som väljer en specifik index i projectList att skicka till client
// Return a specific project response ( DeBUG MODE RN )
const GetProject = (response, id) => {
	
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
	//let output = JSON.stringify(projectList.projects[0]);
	console.log("Made it here!!");
	response.write("Test Projects Page");
	response.end();
}


// Exports the method so it can be imported(require) in another file
module.exports = {
	GetProject,
	FillProjectList,
	GenerateProjectFile,
	ProjectsPage
};