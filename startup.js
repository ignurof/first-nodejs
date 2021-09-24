const projects = require("./projects.js");

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
			projects.GenerateProjectFile();
		} else {
			throw error;
		}
	});
}

module.exports = ValidateProjects;