const fs = require("fs");
const projects = require("./projects.js");
const about = require("./about.js");

// Everything related to startup file validation and other related topics
const ValidateProjects = () => {
    // Check if projectList.json exist
	fs.stat("projectList.json", (error, stat) => {
		if(error == null) {
			// If the file exists
			console.log('File exists');
			projects.FillProjectList();
		} else if(error.code === 'ENOENT') {
			// If the file does not exist
			console.log("File does not exist");
			// Adds a new project to projectList object and then runs CreateProjectListJSON() to create or overwrite the file
			projects.AddProject("Jetpack Doggo 1", "C#, Unity", "Text about the game", ["jp1.jpg", "jp2.jpg", "jp3.jpg", "jp4.jpg"]);
		} else {
			throw error;
		}
	});
	// Check if about.json exist
	fs.stat("about.json", (error, stat) => {
		if(error == null){
			// If file exist
			console.log("About file exist");
		} else if(error.code === "ENOENT"){
			// If file does not exist
			console.log("About file does not exist");
			// Create about file
			about.CreateNewAboutFile();
		} else {
			throw error;
		}
	});
}

module.exports = ValidateProjects;