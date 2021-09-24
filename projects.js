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

// Respond with the projectList
const GetProjectList = (response) => {
	// Open filestream and try to read the file
	fs.readFile("projectList.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error){
			console.log("read error"); // DEBUG
		}

		// Keep the projectList variable populated so I can use it by parsing the JSON data into readable format
		projectList = JSON.parse(data);
		console.log(projectList);

		// Send to client
		response.write(data);
		response.end();
	});
}

// If the projectList didnt exist, create it and respond with it
const GenerateProjectList = (response) => {
	// Add new project to projectList
	AddProject(1, "Jetpack Doggo 1", "C#, Unity", "Text about the game", ["jp1.jpg", "jp2.jpg", "jp3.jpg", "jp4.jpg"]);
	
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

	// Send to client
	response.write(data);
	response.end();
}

// Respond with appropriate projects method, but the gist of it is respond with projectList.json
const ProjectsPage = (response) => {
	// Check if projectList.json exist
	fs.stat("projectList.json", (error, stat) => {
		if(error == null) {
			// If the file exists
			console.log('File exists');
			return GetProjectList(response);
		} else if(error.code === 'ENOENT') {
			// If the file does not exist
			console.log("File does not exist");
			return GenerateProjectList(response);
		} else {
			throw error;
		}
	});
}


// Exports the method so it can be imported(require) in another file
module.exports = ProjectsPage;