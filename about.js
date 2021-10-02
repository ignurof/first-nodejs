const fs = require("fs");
const { decode } = require("querystring");
const ErrorPage = require("./errors.js");

// JSON Object
let aboutContent = {
    "about": "Hello, World!"
};

const EditAboutContent = (newText) => {
    // Take the URL string (weird characters for whitespace etc) and turn it into regular string
    newText = decodeURIComponent(newText);

    // Assign new values from input params
    aboutContent.about = newText;

    // Regenerate file with new values
    CreateNewAboutFile();
}

const CreateNewAboutFile = () => {
    // convert into JSON string
	let data = JSON.stringify(aboutContent);

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

        // Put the data into the server var
        aboutContent.about = data.about;
    });
}

const AboutPage = (response) => {
    // Send the response back to client
    response.end(aboutContent.about);
}

// Exports the method so it can be imported(require) in another file
module.exports = {
    AboutPage,
    EditAboutContent,
    FillAboutContent,
    CreateNewAboutFile
};