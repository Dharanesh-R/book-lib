import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function User() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [googleSearchTerm, setGoogleSearchTerm] = useState('');
  const [externalBooks, setExternalBooks] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
    fetchCategories(); // Fetch categories on mount
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchWishlist = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/users/email/${userEmail}/wishlist`);
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories'); // Modify this endpoint as needed
      setCategories(response.data); // Assuming response contains a list of categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToWishlist = async (book) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User not logged in');
      return;
    }

    const newBook = {
      ...book,
      _id: book.id || book._id, // Ensure there is an _id
    };

    try {
      await axios.put(`http://localhost:5000/users/email/${userEmail}/wishlist`, { book: newBook });
      toast.success('Book added to wishlist!');
      fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Book already in the wishlist');
    }
  };

  const deleteFromWishlist = async (bookId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User not logged in');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/users/email/${userEmail}/wishlist/${bookId}`);
      toast.success('Book removed from wishlist!');
      fetchWishlist();
    } catch (error) {
      console.error('Error deleting from wishlist:', error);
      toast.error('Error removing book from wishlist');
    }
  };

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  const searchGoogleBooks = async (query) => {
    if (!query) {
      setExternalBooks([]);
      return;
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      setExternalBooks(response.data.items || []);
    } catch (error) {
      console.error('Error fetching from Google Books API:', error);
      if (error.response && error.response.status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
    }
  };

  const handleSearchClick = () => {
    searchGoogleBooks(googleSearchTerm);
  };

  const handleImageClick = (book) => {
    const searchQuery = book.volumeInfo.title + (book.volumeInfo.authors ? ` ${book.volumeInfo.authors.join(', ')}` : '');
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <div>
      <ToastContainer />
      <h2>Available Books</h2>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />
      <label style={styles.label}>Category: </label>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={styles.dropdown}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={toggleWishlist} style={styles.wishlistButton}>
        {showWishlist ? 'Hide Wishlist' : 'Show Wishlist'}
      </button>

      {showWishlist && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.category}</td>
                <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteFromWishlist(item._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.bookContainer}>
        {externalBooks.map((book) => (
          <div key={book.id} style={styles.bookCard}>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              style={styles.bookImage}
              onClick={() => handleImageClick(book)}
            />
            <h3
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => window.open(book.volumeInfo.infoLink, '_blank')}
            >
              {book.volumeInfo.title}
            </h3>
            <p>Author: {book.volumeInfo.authors?.join(', ')}</p>
            <p>Category: {book.volumeInfo.categories?.join(', ')}</p>
            <button onClick={() => addToWishlist(book)} style={styles.wishlistButton}>
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>

      <div style={styles.bookContainer}>
        {books
          .filter((book) => {
            const matchesSearch =
              book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter ? book.category === categoryFilter : true;
            return matchesSearch && matchesCategory;
          })
          .map((book) => (
            <div key={book._id} style={styles.bookCard}>
              <img
                src={`http://localhost:5000/${book.image.replace(/\\/g, '/')}`}
                alt={book.title}
                style={styles.bookImage}
                onClick={() => handleImageClick(book)}
              />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Category: {book.category}</p>
              <button onClick={() => addToWishlist(book)} style={styles.wishlistButton}>
                Add to Wishlist
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  bookContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px',
  },
  bookCard: {
    flexWrap: 'wrap',
    backgroundColor: '#c7c7c7',
    margin: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px 40px',
    textAlign: 'center',
    cursor: 'pointer',
    
  },
  bookImage: {
    width: '200px',
    height: '100px',
    maxHeight: '200px',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  wishlistButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    marginTop: '20px',
    width: '100%',
    borderCollapse: 'collapse',
  },
  searchInput: {
    margin: '10px 0',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
  },
  dropdown: {
    margin: '10px 10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  label: {
    marginRight: '10px',
  },
  cancelButton: {
    margin: '10px 0',
    padding: '8px 12px',
    backgroundColor: '#cccccc',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  searchButton: {
    margin: '10px 10px',
    padding: '8px 12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default User;
