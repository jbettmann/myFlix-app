// imports http module and set it to a variable. Allows us to access its function createServer()
const http = require('http'),
    fs = require('fs'),
    url = require('url');

// Called the "Request Handler". Function will be called every time an HTTP request in made to server
http.createServer((request, response) => {
    // setting url requested by user to variable addr
    let addr = request.url,
        q = url.parse(addr, true),
        // filePath is empty now an will be set in if-else statement below
        filePath = '';

    // .appendFile takes three arguments 1. file to append to 2. info to be appended 3. error handling 
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    }); 
    
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
      } else {
        filePath = 'index.html';
      }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // if throw, program in terminated and no statement following will be executed
            throw err;
        }

        // tells server to add header with response along with HTTP code "200" for OK
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        // ends response by sending message "Hello Node!"
        response.end();
    });
        // server is set to listen for request on port 8080. (80 is standard HTTP port BUT you can use any number AS LONG AS it's less than 1024. Less than 1024 reserved for OS)
    }).listen(8080);

console.log('My test server is running on Port 8080.');
