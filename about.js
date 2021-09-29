const fs = require("fs");
const ErrorPage = require("./errors.js");

const CreateNewAboutFile = () => {
    let aboutObject = {
        "about": "Hello, World!"
    };

    // convert into JSON
	let data = JSON.stringify(aboutObject);

	// Create new file or overwrite file
	fs.writeFile("about.json", data, (error) => {
		if(error){
			console.log("write error"); // DEBUG
		}

		// Very useful server logging
		console.log("about.json created");
	});
}

const AboutPage = (response) => {
    // Open filestream and try to read the file
    fs.readFile("about.json", (error, data) => {
        // 404 - If file does not exist, or other error
        if(error) return ErrorPage(response);
        // Write the data to the client
        response.write(data);
        // End the response so client recieve it
        response.end();
    });
}

// Exports the method so it can be imported(require) in another file
module.exports = {
    AboutPage,
    CreateNewAboutFile
};