import bp from "body-parser";
import pg from "pg";
import express from "express";
import axios from "axios";

const PORT = 3000;
const app = express();

app.use(express.static("public"));
app.use(bp.urlencoded({extended: true}));

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
});

// show add books page
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
});

// get notes when user clicks on title
app.get("/notes/:id", async (req, res) => {
    debugger;
    const book_id = req.params.id;
    const query_result = await db.query("SELECT isbn, title, rating, author, notes_and_rev FROM books INNER JOIN book_info ON book_info.id = books.id WHERE book_info.id = $1", 
    [book_id]);
    let book_info = query_result.rows[0];
    res.render("details.ejs", {book: book_info});
});

// edit an already existing entry's details
// send to edit page
app.get("/edit/:id", async (req, res) => {
    const book_id = req.params.id;
    // get all the info for the book so we can display them in the edit window
    const query_result = await db.query("SELECT books.id, isbn, title, rating, author, summary, notes_and_rev FROM books INNER JOIN book_info ON book_info.id = books.id WHERE book_info.id = $1", 
    [book_id]);
    const book_info = query_result.rows[0];

    res.render('edit.ejs', {book: book_info});
});
// edit values in database based on what has changed
app.post("/edit/:id", async (req, res) => {
    const book_id = req.params.id;
    const query_result = await db.query("SELECT isbn, title, rating, author, summary, notes_and_rev FROM books INNER JOIN book_info ON book_info.id = books.id WHERE book_info.id = $1", 
    [book_id]);
    const book_info_res = query_result.rows[0];

    let newquery = "UPDATE books SET ";
    let values = [];
    let paramCount = 1; // updates "$1 -> $2 -> $3" based on number of params gotten from the request
    // checking against current values in the database to see what has changed

    console.log(req.body);
    if(req.body.title != book_info_res.title) {
        newquery += `title=$${paramCount}, `
        values.push(req.body.title);
        paramCount++;
    }

    if(req.body.author != book_info_res.author) {
        newquery += `author=$${paramCount}, `
        values.push(req.body.author);
        paramCount++;
    }

    if(req.body.rating != book_info_res.rating) {
        newquery += `rating=$${paramCount}, `
        values.push(req.body.rating);
        paramCount++;
    }

    if(req.body.shortDescription != book_info_res.summary) {
        newquery += `summary=$${paramCount}, `
        values.push(req.body.shortDescription);
        paramCount++;
    }

    if(req.body.isbn != book_info_res.isbn) {
        newquery += `isbn=$${paramCount}, `
        values.push(req.body.isbn);
        paramCount++;
    }

    // separate query to update book_info table
    if(req.body.reviewNotes != book_info_res.notes_and_rev) {
        db.query("UPDATE book_info SET notes_and_rev=$1 WHERE id=$2", [req.body.reviewNotes, book_id]);
    }

    newquery = newquery.slice(0,-2); // remove last comma and space
    newquery += ` WHERE books.id = ${book_id}`;
    // if we actually made any changes then query the database
    if(values.length != 0) { 
        db.query(newquery, values);
    }

    res.redirect("/");

});

app.post("/delete/:id", async (req, res) => {
    const book_id = req.params.id;

    db.query("DELETE FROM books WHERE id = $1", [book_id]);
    db.query("DELETE FROM book_info WHERE id = $1", [book_id]);

    res.redirect("/");
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
