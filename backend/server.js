// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');

// const app = express();
// app.use(express.json());

// // CORS configuration
// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

// // MongoDB connection
// const MONGO_URI = 'mongodb://localhost:27017/DL'; // Replace with your MongoDB URI

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//         process.exit(1);
//     });

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     books: [{
//         _id: mongoose.Schema.Types.ObjectId,
//         title: String,
//         author: String,
//         category: String,
//         dateAdded: String
//     }],
//     cart: [{
//         _id: mongoose.Schema.Types.ObjectId,
//         title: String,
//         author: String,
//         category: String,
//         dateAdded: String
//     }]
// });



// const User = mongoose.model('User', userSchema);


// // Middleware to authenticate using a hardcoded token
// const authenticate = (req, res, next) => {
//     const token = req.headers['x-access-token'];
//     if (!token) return res.status(401).json({ message: 'No token provided' });

//     // Validate hardcoded token (for simplicity)
//     if (token.startsWith('user-token-')) {
//         req.userId = token.split('user-token-')[1];
//         next();
//     } else {
//         res.status(401).json({ message: 'Failed to authenticate token' });
//     }
// };



// // Sign Up
// app.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, email, password: hashedPassword });
//         await user.save();
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (err) {
//         res.status(400).json({ message: 'Error: Email might already be taken' });
//     }
// });

// // Login
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//         // Hardcoded token (for simplicity)
//         const token = 'user-token-' + user._id; // Example token, use a better approach in production
//         res.json({ token });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Get user books
// app.get('/books', authenticate, async (req, res) => {
//     try {
//         const user = await User.findById(req.userId);
//         res.json(user.books);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Add a new book
// app.post('/books', authenticate, async (req, res) => {
//     const { title, author, category, dateAdded } = req.body;
//     try {
//         const user = await User.findById(req.userId);
//         user.books.push({ _id: new mongoose.Types.ObjectId(), title, author, category, dateAdded });
//         await user.save();
//         res.status(201).json(user.books[user.books.length - 1]);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Update a book
// // const handleUpdateBook = async (e) => {
// //     e.preventDefault();

// //     if (!editBook) return;

// //     try {
// //         const token = document.cookie.split('token=')[1];
// //         const response = await axios.put(`http://localhost:5000/books/${editBook._id}`, newBook, {
// //             headers: { 'x-access-token': token }
// //         });

// //         const updatedBooks = books.map((book) =>
// //             book._id === editBook._id ? response.data : book
// //         );

// //         setBooks(updatedBooks);
// //         setFilteredBooks(updatedBooks);
// //         setEditBook(null);
// //         setNewBook({ title: '', author: '', category: '' });
// //         setIsAddingBook(false);
// //     } catch (err) {
// //         console.error("Error updating book:", err);
// //         alert("An error occurred while updating the book.");
// //     }
// // };

// const handleUpdateBook = async (e) => {
//     e.preventDefault();

//     if (!editBook) return;

//     try {
//         const token = document.cookie.split('token=')[1];
//         console.log('Token:', token);
//         console.log('Edit Book:', editBook);
//         console.log('New Book:', newBook);

//         const response = await axios.put(`http://localhost:5000/books/${editBook._id}`, newBook, {
//             headers: { 'x-access-token': token }
//         });

//         console.log('Response:', response.data);

//         const updatedBooks = books.map((book) =>
//             book._id === editBook._id ? response.data : book
//         );

//         setBooks(updatedBooks);
//         setFilteredBooks(updatedBooks);
//         setEditBook(null);
//         setNewBook({ title: '', author: '', category: '' });
//         setIsAddingBook(false);
//     } catch (err) {
//         console.error("Error updating book:", err);
//         alert("An error occurred while updating the book.");
//     }
// };


// // Delete a book
// app.delete('/books/:id', authenticate, async (req, res) => {
//     const { id } = req.params;
//     try {
//         // Find the user by ID
//         const user = await User.findById(req.userId);
//         if (!user) {
//             console.error('User not found');
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Find the book by ID within the user's books
//         const book = user.books.id(id);
//         if (!book) {
//             console.error('Book not found');
//             return res.status(404).json({ message: 'Book not found' });
//         }

//         // Remove the book
//         book.remove();
//         await user.save(); // Save the updated user document

//         // Send response with the updated list of books
//         res.json(user.books);
//     } catch (err) {
//         console.error('Error deleting book:', err); // Log the full error object
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });



// // Logout
// app.post('/logout', (req, res) => {
//     // Hardcoded token, nothing to do on server-side for logout
//     res.json({ message: 'Logged out successfully' });
// });

// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });






























const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Add this line
const User = require('./models/User'); // Import the User model
const Book = require('./models/Book'); // Import Book model

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/DL'; // Replace with your MongoDB URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Middleware to authenticate using a hardcoded token
const authenticate = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Validate hardcoded token (for simplicity)
    if (token.startsWith('user-token-')) {
        req.userId = token.split('user-token-')[1];
        next();
    } else {
        res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

// Sign Up
app.post('/signup', async (req, res) => {
    const { username, email, password, phone } = req.body; // Include phone
    try {
        const user = new User({ username, email, password, phone }); // Include phone
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error: Email might already be taken' });
    }
});

// Login
// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Hardcoded token (for simplicity)
        const token = 'user-token-' + user._id; // Example token, use a better approach in production
        res.json({ token, role: user.role }); // Return the role in the response
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Add a new book
app.post('/books', upload.single('image'), async (req, res) => {
    const { title, author, category } = req.body;
    const image = req.file.path; // Use the path from multer
    try {
        const book = new Book({ title, author, category, image });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error adding book' });
    }
});

// Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a book
app.put('/books/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, author, category } = req.body;
    let image = req.file ? req.file.path : undefined; // Check if a new file was uploaded

    try {
        const updatedData = { title, author, category };
        if (image) {
            updatedData.image = image; // Only update the image if a new one was uploaded
        }
        const book = await Book.findByIdAndUpdate(id, updatedData, { new: true });
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error updating book' });
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        res.json({ message: 'Book deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting book' });
    }
});

app.put('/users/email/:email/wishlist', async (req, res) => {
    try {
        const userEmail = req.params.email;
        const { book } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the book already exists in the wishlist
        const alreadyInWishlist = user.wishlist.some(item => item._id.toString() === book._id);
        if (alreadyInWishlist) {
            return res.status(400).json({ message: 'Book is already in wishlist' });
        }

        // Add the book to the wishlist
        user.wishlist.push(book);
        await user.save();

        res.status(200).json({ message: 'Book added to wishlist' });
    } catch (error) {
        console.error('Error while adding to wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Fetch user wishlist by email
app.get('/users/email/:email/wishlist', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the user's wishlist
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a book from user's wishlist
app.delete('/users/email/:email/wishlist/:bookId', async (req, res) => {
    const userEmail = req.params.email;
    const bookId = req.params.bookId;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter out the book from the wishlist
        user.wishlist = user.wishlist.filter(item => item._id.toString() !== bookId);
        await user.save();

        res.status(200).json({ message: 'Book removed from wishlist' });
    } catch (error) {
        console.error('Error deleting from wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await Book.distinct('category'); // Fetch distinct categories from the 'category' field in the Book collection
        res.json(categories); // Return the categories as a JSON array
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

// Other routes...

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
