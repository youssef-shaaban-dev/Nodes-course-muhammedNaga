import * as http from "http";
import fs, { promises as fsPromises } from "fs";
import path from "path";

const PORT = 5000;

const server = http.createServer((req, res) => {

  const ProductsFilePath = path.join(
    import.meta.dirname,
    "data",
    "products.json",
  );

  const assetPath = path.join(import.meta.dirname, "assets");

  console.log("File Path : ", assetPath);

  if (req.url === "/products") {
    fs.access(ProductsFilePath, (err) => {
      if (err) {
        console.error(
          "File does Not Exist or Cannot be accessed : ",
          ProductsFilePath,
        );
        return;
      }

      fs.readFile(ProductsFilePath, "utf8", (err, data) => {
        const jsonProducts: {
          products: [{ id: number; title: string; description: string }];
        } = JSON.parse(data);

        res.writeHead(200, { "Content-Type": "application/json" });

        console.log("Data=> : ", jsonProducts);

        res.write(data);

        res.end();
      });
    });
  } else if (req.url === "/products/new") {
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
  } else if (req.method === "POST" && req.url === "/add-product") {
    res.writeHead(201, { "content-type": "text/html" });

    let body = "";

    req.on("data", (data) => {
      body += data.toString();
    });

    req.on("end", async () => {
      const data = new URLSearchParams(body);
      const title = data.get("title")!;
      const description = data.get("description")!;

      try {

        const jsonData = await fsPromises.readFile(ProductsFilePath, "utf8");

        const jsonProducts: {
          products: [{ id: number; title: string; description: string }];
        } = JSON.parse(jsonData);

        jsonProducts.products.push({
          id: jsonProducts.products.length + 1,
          title,
          description,
        });

        const updatedData = JSON.stringify(jsonProducts, null, 2);

        await fsPromises.writeFile(ProductsFilePath, updatedData, { flag: "w" });

      } catch (error) {
        console.error(error);
      }

      res.write(`<div>
      <h1>product has been added!</h1>
      <h2>title : ${title}</h2>
      <h2>description : ${description}</h2>
      </div>`);
      res.end();
    });
  } else if (req.url === "/") {
    res.write("<h1>Welcome Back</h1>");
    res.end();
  }
  else if (req.method === "GET" && req.url === "/assets") {

    fs.access(assetPath, (err) => {
      if (err) {
        console.error(
          "File does Not Exist or Cannot be accessed : ",
          assetPath,
        );
        return;
      };


      fs.readdir(assetPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
        res.writeHead(200, { "content-type": "text/html" });
        res.write("<h1>Here are your assets : </h1>");
        res.write("<ul/>");
        files.forEach(file => {
          res.write(`<li><a href="/delete?file=${encodeURIComponent(file)}">${file}</a></li>`)
        });
        res.write("<ul/>");
        res.end();
      })
    });

  }
  else if (req.method === "GET" && req.url?.startsWith('/delete')) {
    const file = decodeURIComponent(req.url.split("?")[1].split("=")[1]);
    const assetPath = path.join(import.meta.dirname, "assets", file);

    fs.access(assetPath, (err) => {
      if (err) {
        console.error("File does Not Exist or Cannot be accessed : ", assetPath);
      }
      return;
    })

    fs.unlink(assetPath, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    })

    res.write(`<h1>File ${file} has beend deleted </h1>`);
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
