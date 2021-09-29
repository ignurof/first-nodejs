// Import filesystem/filestream lib
const fs = require("fs");

// This is where I store all the projects during server uptime
let projectList = {
	"projects": []
};

// Delete a project by id reference
const DeleteProject = (id) => {
	// Iterate over all projects until correct one is found
	for(let x = 0; x < projectList.projects.length; x++){
		if(id == projectList.projects[x].id){
			// Remove array values starting at index point, with howmany amount
			projectList.projects.splice(x, 1);

			// Update ID to fit the position in array
			UpdateProjectID();

			// Regenerate file with updated projectList values
			CreateProjectListJSON();

			// Return out so it doesnt keep iterating over the list incase of long length
			return;
		}
	}
}

// Updates the projectList projectid to better match the array index
const UpdateProjectID = () => {
	for(let x = 0; x < projectList.projects.length; x++){
		// Take the current index value and add one to have appropriate projectid
		projectList.projects[x].id = x + 1;
	}
}

// Update a current project by editing its values
const EditProject = (id, title, summary, content, images) => {
	// Iterate over all projects until correct one is found
	for(let x = 0; x < projectList.projects.length; x++){
		if(id == projectList.projects[x].id){
			// Set new values according to params
			projectList.projects[x].title = title;
			projectList.projects[x].summary = summary;
			projectList.projects[x].content = content;
			projectList.projects[x].images = images;

			return; // Early return so it doesnt keep looping
		}
	}
}

// Adds a new project to the list.
const AddProject = (title, summary, content, images) => {
	// Get the current projects length, meaning the index amount
	let x = projectList.projects.length;
	// Add one to compensate for index starting at 0
	let id = x + 1;

	// JSON Object, or rather just JSON
	let project = {
		"id": id,
		"title": title,
		"summary": summary,
		"content": content,
		"images": images
	};

	// Append to list
	projectList["projects"].push(project);

	// Append to file by generating a new file with the updated projectList
	CreateProjectListJSON();
}

// Return a specific project response
const GetProject = (id) => {
	// Declare variable to give back to client later
	let data;

	// Iterate over available projects and when correct one found, print out the entire object
	for(let x = 0; x < projectList.projects.length; x++){
		if(projectList.projects[x].id == id){
			console.log(projectList.projects[x]);
			// convert into JSON string so it can be sent to client
			data = JSON.stringify(projectList.projects[x]);

			return data; // Early return so we dont end up at the end of the method
		}
	}
	console.log("Error GetProject()");
}

// Reads the JSON-file and fill the projectList variable
// Happens on server startup and whenever required
const FillProjectList = () => {
	// Open filestream and try to read the file
	fs.readFile("projectList.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error){
			console.log("read error"); // DEBUG
		}

		// parse the JSON string back into JSON object
		let parsedJSON = JSON.parse(data);

		// Assign the new parsedJSON values to the projectList
		projectList = parsedJSON
	});
}

// Create a new file or overwrite existing one with new contents of projectList variable
const CreateProjectListJSON = () => {
	// convert into JSON
	let data = JSON.stringify(projectList);

	// Create new file or overwrite file
	fs.writeFile("projectList.json", data, (error) => {
		if(error){
			console.log("write error"); // DEBUG
		}

		// Very useful server logging
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
	DeleteProject,
	EditProject,
	AddProject,
	GetProject,
	FillProjectList,
	ProjectsPage
};