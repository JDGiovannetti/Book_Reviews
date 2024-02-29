-- delete all data
DROP TABLE books;
DROP TABLE book_info;

-- create books table
CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	isbn CHAR(13),
	title VARCHAR(100) NOT NULL,
	rating INTEGER,
	author VARCHAR(50) NOT NULL,
	summary TEXT
);

-- create book_info table
CREATE TABLE book_info (
	id SERIAL PRIMARY KEY,
	book_id INTEGER,
	notes_and_rev TEXT,
	CONSTRAINT fk_book
		FOREIGN KEY(book_id)
			REFERENCES books(id)
);



-- sample data
INSERT INTO books (isbn, title, author, rating, summary)
VALUES 
(9780765326355, 'The Way of Kings', 'Brandon Sanderson',
 10, 'The world Sanderson creates absolutely blew my mind and made me devour the 1000 page epic in a few short weeks.'),
(9780198185215, '1984', 'George Orwell', 
10, 'The third time I read this was the best, and the most significant. George Orwell is clearly a genius.');

INSERT INTO book_info (id, notes_and_rev)
VALUES
(1, 'Defo my favorite book now, though I’m not a huge reader.

Sanderson’s simple yet intensely descriptive language and his attention to detail create an amazing world that is both effortless to picture and get lost in. This book has a lot of little bits that are there for little else than world building, which I would expect to dislike, but it was surprising to see how easily (and happily) I could get sucked into the intricacies of Roshar. It is a joy to explore this world. This entire book is like a good meal at Raising Canes, and the world is the sauce that perfects all else that touches it.

The plot itself is great. It’s interesting and compelling and full of mysteries to be uncovered. It’s clear to see how each plot line connects to how the world has forced it to occur. These are not disconnected, forced happenings, but rather the environment has made these things happen — they sprung up out of it as a natural consequence. It could not have been any other way.

Each character in this book is so unique and full of depth. They go through genuine dilemmas and face genuine difficulties and feel genuine joy. They grow and fall and learn. You feel a real connection with these characters. You join them on their journey. You feel what they feel and see what they see. Even characters who I found a little annoying at times are still so likable, striving for growth and good. Some characters are shrouded in mystery like and yet their reactions to the smallest of things give you a huge glimpse into the core of their being. These characters feel so real because they feel like products of this incredibly detailed world — a virtue of Sanderson’s writing I cannot emphasize enough. They didn’t pop into the plot fully formed. They made their way through their childhoods and through traumas and victories from months, years, and decades past. It just makes them feel so much more *real*, and I loved that.

This is a very long read (~1000 pages), but it’s worth every second. It didn’t feel long because it sucks you in so easily. Highly recommended!'),
(2, 'Alright, this was my third read through in my life and I’ve never been so clearly faced with my past ignorance. I used to think this book was “just okay” and that Orwell just kind of wrote this for writing’s sake and tried to make an interesting story that ultimately fell a bit flat. I was wrong. Orwell is clearly a genius.

What an unbelievably prescient view of the future. It’s like Orwell jumped in a time machine and lived in our time for a year before heading back to whip up this masterpiece.

This novel is *extremely* deep. There are so many twists, metaphors, analogies, questions, philosophical ideas, technologies, minds, and characters to explore. A university class may just begin to grasp the immensity of the concepts that 1984 deals with, such is the depth of the writing. I am still stunned at how rich each part of this text is.

Absolutely a must read for anyone. Utterly profound. Incredibly bleak. Very important.');