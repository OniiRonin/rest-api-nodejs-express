import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Función para leer datos desde el archivo db.json
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
};

// Función para escribir datos en el archivo db.json
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

// Ruta principal que muestra un mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

// Ruta para obtener todos los libros
app.get("/books", (req, res) => {
  const data = readData();
  if (data) {
    res.json(data.books);
  } else {
    res.status(500).json({ error: "Could not read data" });
  }
});

// Ruta para obtener un libro específico por su ID
app.get("/books/:id", (req, res) => {
  const data = readData();
  if (data) {
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } else {
    res.status(500).json({ error: "Could not read data" });
  }
});

// Ruta para crear un nuevo libro
app.post("/books", (req, res) => {
  const data = readData();
  if (data) {
    const body = req.body;
    if (!body.name || !body.author || !body.year) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const newBook = {
      id: data.books.length + 1,
      ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.status(201).json(newBook);
  } else {
    res.status(500).json({ error: "Could not read data" });
  }
});

// Ruta para actualizar un libro existente por su ID
app.put("/books/:id", (req, res) => {
  const data = readData();
  if (data) {
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
      };
      writeData(data);
      res.json({ message: "Book updated successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } else {
    res.status(500).json({ error: "Could not read data" });
  }
});

// Ruta para eliminar un libro existente por su ID
app.delete("/books/:id", (req, res) => {
  const data = readData();
  if (data) {
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      data.books.splice(bookIndex, 1);
      writeData(data);
      res.json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } else {
    res.status(500).json({ error: "Could not read data" });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
