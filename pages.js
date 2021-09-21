// Universal pages file for readability

const AboutPage = require("./about.js");
const ProjectsPage = require("./projects.js");

const DefaultPage = (response ) => {
    response.write("Something went wrong with server request, contact admin.");
    response.end();
}

// Exports the methods so they can be imported(require) in another file
module.exports = {
    AboutPage,
    ProjectsPage,
    DefaultPage
};