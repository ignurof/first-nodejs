// 404 page
export const ErrorPage = (response) => {
    response.writeHead(404);
    response.write("Error");
}