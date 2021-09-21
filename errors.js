// 404 page
const ErrorPage = (response) => {
    response.writeHead(404);
    // Write the data to the client
    response.write("Error");
    // End the response so client recieve it
    response.end();
}

// Exports the method so it can be imported(require) in another file
module.exports = ErrorPage;