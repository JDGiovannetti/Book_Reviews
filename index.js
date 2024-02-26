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
app.get("/notes/:id", (req, res) => {
    const book_id = req.params.id;
    let book_info = {

    }
})

// add books
app.get("/add", (req, res) => {
    res.render('add.ejs')
});

app.post

// edit an already existing entry's details
app.get("/edit/:id", (req, res) => {
    console.log(req.params.id);
    res.redirect('/');
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));