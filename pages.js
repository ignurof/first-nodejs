const DefaultPage = (response ) => {
    response.write("Default page display right now");
    response.end();
}

// Exports the methods so they can be imported(require) in another file
module.exports = DefaultPage;