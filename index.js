import bp from "body-parser";
import pg from "pg";
import express from "express";
import axios from "axios";

const PORT = 3000;
const app = express();

app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client(
{   user: "postgres",
    password: "super",
    host: "localhost",
    database: "book_revs_notes",
    port: 5432
});
db.connect();

app.get("/", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id DESC');
        const books = result.rows; // Assuming 'rows' holds your book data; adjust based on your DB client
        res.render("index.ejs", {books: books}); // Make sure 'index' points to your EJS file correctly
    } catch (error) {
        console.error('Error fetching books:', error);
        res.send("Error fetching books");
    }
})

app.get("/notes/:id", (req, res) => {
    let book_info = {

    }

    res.redirect('/');
})

app.get("/edit/:id", (req, res) => {
    console.log('we edit this hoe');
    res.redirect('/');
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
