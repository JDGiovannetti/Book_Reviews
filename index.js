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
    database: "book_reviews",
    port: 5432
});

app.get("/", (req, res) => {
    res.render("index.ejs");
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
