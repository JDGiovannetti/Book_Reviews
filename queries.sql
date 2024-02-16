-- create books table
CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	isbn CHAR(13),
	title VARCHAR(100) NOT NULL,
	rating INTEGER,
	author VARCHAR(50) NOT NULL,
	summary TEXT
)

-- create book_info table
CREATE TABLE book_info (
	id SERIAL PRIMARY KEY,
	book_id INTEGER,
	summary TEXT,
	CONSTRAINT fk_book
		FOREIGN KEY(book_id)
			REFERENCES books(id)
)

-- sample data
INSERT INTO books (isbn, title, author, rating, summary)
VALUES 
(9780765326355, 'The Way of Kings', 'Brandon Sanderson',
 10, 'The world Sanderson creates absolutely blew my mind and made me devour the 1000 page epic in a few short weeks.'),
(9780198185215, '1984', 'George Orwell', 
10, 'The third time I read this was the best, and the most significant. George Orwell is clearly a genius.');