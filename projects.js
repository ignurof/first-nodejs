// Import filesystem/filestream lib
const fs = require("fs");

// This is where I store all the projects during server uptime
let projectList = {
	"projects": []
};

const ProjectsLength = () => {
	return projectList.projects.length;
}

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
		//projectList.projects[x].id = x + 1; OLD here, NEW below
		projectList.projects.map(x => x.id + 1);
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
			
			// Early return so it doesnt keep looping
			return;
		}
	}
}

// Adds a new project to the list.
const AddProject = (title, summary, content, images) => {
	// Add one to compensate for index starting at 0
	let id = projectList.projects.length + 1;

	// JSON Object, or rather just JSON
	// When only using var names its called Self-Referencing
	let project = {
		id,
		title,
		summary,
		content,
		images
	};

	// Append to list
	projectList["projects"].push(project);

	// Append to file by generating a new file with the updated projectList
	CreateProjectListJSON();
}

// Return a specific project response
const GetProject = (id) => {
	// Iterate over available projects and when correct one found, print out the entire object
	for(let x = 0; x < projectList.projects.length; x++){
		if(projectList.projects[x].id == id){
			// convert into JSON string so it can be sent to client
			return JSON.stringify(projectList.projects[x]); // Early return so we dont end up at the end of the method
		}
	}
	console.error("Error GetProject()");
}

// Reads the JSON-file and fill the projectList variable
// Happens on server startup and whenever required
const FillProjectList = () => {
	// Open filestream and try to read the file
	fs.readFile("projectList.json", (error, data) => {
		// 404 - If file does not exist, or other error
		if(error){
			console.error("read error"); // DEBUG
		}

		// parse the JSON string back into JSON object
		// Assign the new parsedJSON values to the projectList
		projectList = JSON.parse(data);
	});
}

// Create a new file or overwrite existing one with new contents of projectList variable
const CreateProjectListJSON = () => {
	// convert into JSON string with stringy from object
	// Create new file or overwrite file
	fs.writeFile("projectList.json", JSON.stringify(projectList), (error) => {
		if(error){
			console.error("write error"); // DEBUG
		}

		// Very useful server logging
		console.error("projectList.json created");
	});
}

// Respond with appropriate projects method, but the gist of it is respond with projectList.json
const ProjectsPage = (response) => {
	// Take projectList object and stringify so it can be sent to client
	// Send to client
	response.write(JSON.stringify(projectList));
	response.end();
}

// Exports the method so it can be imported(require) in another file
module.exports = {
	ProjectsLength,
	DeleteProject,
	EditProject,
	AddProject,
	GetProject,
	FillProjectList,
	ProjectsPage
};