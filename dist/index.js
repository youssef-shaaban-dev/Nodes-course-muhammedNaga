import * as http from "http";
const PORT = 5000;
const server = http.createServer((req, res) => {
    if (req.url === "/products") {
        res.writeHead(200, { "Content-Type": "application/json" });
        const data = {
            products: [
                { id: 1, name: "test" },
                { id: 2, name: "test2" },
            ],
        };
        res.write(JSON.stringify(data));
        res.end();
    }
    else if (req.url === "/products/new") {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(`<html>
      <head>
       <title>Add New Product</title>
      </head>
        <body>
          <div>
            <form method="POST" action="/add-product">
              <label for"title">Title :</label> <br/>
              <input type="text" id="title" name="title" required/> <br/>
              <label for"description">Description :</label> <br/>
              <input type="text" id="description" name="description" required/> <br/>
              <button type="submit">Submit</button>
          </form>
        </div>
      </body>
      </html>`);
        res.end();
    }
    else if (req.method === "POST" && req.url === "/add-product") {
        res.writeHead(201, { "content-type": "text/html" });
        let body = "";
        req.on("data", (data) => {
            body += data.toString();
        });
        req.on("end", () => {
            const data = new URLSearchParams(body);
            const title = data.get("title");
            const description = data.get("description");
            res.write(`<div>
      <h1>product has been added!</h1>
      <h2>title : ${title}</h2>
      <h2>description : ${description}</h2>
      </div>`);
            res.end();
        });
    }
    else if (req.url === "/") {
        res.write("<h1>Welcome Back</h1>");
        res.end();
    }
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("<h1>Not Found Page</h1>");
        res.end();
    }
});
server.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`);
});
