import bp from "body-parser";
import pg from "pg";
import express from "express";
import axios from "axios";

const PORT = 3000;
const app = express();

app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to database
const db = new pg.Client(
{   user: "postgres",
    password: "super",
    host: "localhost",
    database: "book_revs_notes",
    port: 5432
});
db.connect();

// home page 
app.get("/", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id DESC');
        const books = result.rows; 
        res.render("index.ejs", {books: books}); 
    } catch (error) {
        console.error('Error fetching books:', error);
        res.send("Error fetching books");
    }
})

// get notes when user clicks on title
app.get("/notes/:id", async (req, res) => {
    const book_id = req.params.id;
    const query_result = await db.query("SELECT isbn, title, rating, author, notes_and_rev FROM books INNER JOIN book_info ON book_info.id = books.id WHERE book_info.id = $1", 
    [book_id]);
    let book_info = query_result.rows[0];
    console.log(book_info);
    res.render("details.ejs", {book: book_info});
})

// add books page
app.get("/add", (req, res) => {
    res.render('add.ejs')
});
// add the new book to the database
app.post("/add", async (req, res) => {
    try {
        // add the new book to the database
        // insert into the main books table and get the id of the new book
        const new_id = await db.query("INSERT INTO books (isbn, title, rating, author, summary) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [req.body.isbn, req.body.title, req.body.rating, req.body.author, req.body.shortDescription]); 

        // use new id to insert into book_info table holding longer review
        db.query("INSERT INTO book_info (id, notes_and_rev) VALUES ($1, $2)", [new_id.rows[0].id, req.body.reviewNotes]);
        res.redirect("/");
    }
    catch(error) {
        console.error(error);
        res.send("There was an error adding the book!");
    }
})

// edit an already existing entry's details
app.get("/edit/:id", async (req, res) => {
    const book_id = req.params.id;
    const query_result = await db.query("SELECT isbn, title, rating, author, summary, notes_and_rev FROM books INNER JOIN book_info ON book_info.id = books.id WHERE book_info.id = $1", 
    [book_id]);
    const book_info = query_result.rows[0];
    res.render('edit.ejs', {book: book_info});
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));