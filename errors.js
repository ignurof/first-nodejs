// 404 page
const ErrorPage = (response) => {
    response.writeHead(404);
    response.write("Error");
    // End the response so client recieve it
    response.end();
}

// pass the function instead of calling it
module.exports = ErrorPage;