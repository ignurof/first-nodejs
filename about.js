const fs = require("fs");
const ErrorPage = require("./errors.js");

let aboutContent = "Empty";

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

const FillAboutContent = () => {
    // Open filestream and try to read the file
    fs.readFile("about.json", (error, data) => {
        // 404 - If file does not exist, or other error
        if(error) return ErrorPage(response);

        // Parse it back to an object since it was stringified
        data = JSON.parse(data);

        // Print the object
        console.log(data);
        // Prints the value of specific named index
        console.log(data.about);

        // Put the data into the server var
        aboutContent = data.about;
    });
}

const AboutPage = (response) => {
    // Send the response back to client
    response.end(aboutContent);
}

// Exports the method so it can be imported(require) in another file
module.exports = {
    AboutPage,
    FillAboutContent,
    CreateNewAboutFile
};