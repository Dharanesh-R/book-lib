// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './BookLibrary.css';

// function BookLibrary() {
//     const [books, setBooks] = useState([]);
//     const [newBook, setNewBook] = useState({ title: '', author: '', category: '' });
//     const [editBook, setEditBook] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredBooks, setFilteredBooks] = useState([]);
//     const [isAddingBook, setIsAddingBook] = useState(false);
//     const [cart, setCart] = useState([]);
//     const [query, setQuery] = useState('');
//     const [searchedBooks, setSearchedBooks] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchBooks = async () => {
//             try {
//                 const token = document.cookie.split('token=')[1];
//                 if (!token) {
//                     navigate('/login');
//                     return;
//                 }
//                 const response = await axios.get('http://localhost:5000/books', {
//                     headers: { 'x-access-token': token }
//                 });
//                 setBooks(response.data);
//                 setFilteredBooks(response.data);
//             } catch (err) {
//                 console.error("Error fetching books from backend API:", err);
//                 navigate('/login');
//             }
//         };

//         fetchBooks();
//     }, [navigate]);

//     const searchBooks = async (e) => {
//         e.preventDefault();
//         try {
//             const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             setSearchedBooks(data.items || []);
//         } catch (err) {
//             console.error("Error fetching books from Google Books API:", err);
//             alert("An error occurred while fetching books.");
//         }
//     };

//     const addToCart = (book) => {
//         if (!cart.some(item => item.id === book.id)) {
//             setCart([...cart, book]);
//         } else {
//             alert("This book is already in your cart.");
//         }
//     };

//     // const handleAddBook = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //         const token = document.cookie.split('token=')[1];
//     //         const response = await axios.post('http://localhost:5000/books', newBook, {
//     //             headers: { 'x-access-token': token }
//     //         });
//     //         setBooks([...books, response.data]);
//     //         setFilteredBooks([...filteredBooks, response.data]);
//     //         setNewBook({ title: '', author: '', category: '' });
//     //         setIsAddingBook(false);
//     //     } catch (err) {
//     //         console.error("Error adding new book:", err);
//     //         alert("An error occurred while adding the book.");
//     //     }
//     // };

//     const handleAddBook = async (e) => {
//         e.preventDefault();
//         try {
//             const token = document.cookie.split('token=')[1];
//             const bookWithDate = { ...newBook, date: new Date().toISOString() };
//             const response = await axios.post('http://localhost:5000/books', bookWithDate, {
//                 headers: { 'x-access-token': token }
//             });
//             setBooks([...books, response.data]);
//             setFilteredBooks([...filteredBooks, response.data]);
//             setNewBook({ title: '', author: '', category: '' });
//             setIsAddingBook(false);
//         } catch (err) {
//             console.error("Error adding new book:", err);
//             alert("An error occurred while adding the book.");
//         }
//     };
    

//     const handleEditBook = (book) => {
//         setEditBook(book);
//         setNewBook({ title: book.title, author: book.author, category: book.category });
//         setIsAddingBook(true);
//     };

//     const handleUpdateBook = async (e) => {
//         e.preventDefault();

//         if (!editBook) return;

//         try {
//             const token = document.cookie.split('token=')[1];
//             const response = await axios.put(`http://localhost:5000/books/${editBook._id}`, newBook, {
//                 headers: { 'x-access-token': token }
//             });

//             const updatedBooks = books.map((book) =>
//                 book._id === editBook._id ? response.data : book
//             );

//             setBooks(updatedBooks);
//             setFilteredBooks(updatedBooks);
//             setEditBook(null);
//             setNewBook({ title: '', author: '', category: '' });
//             setIsAddingBook(false);
//         } catch (err) {
//             console.error("Error updating book:", err);
//             alert("An error occurred while updating the book.");
//         }
//     };

//     const logout = () => {
//         document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//         navigate('/login');
//     };

//     const handledownload=(a)=>{
//         console.log(a)
//         // window.location.href = `https://www.freebookscity.com/${a}.html?language=EN`;
//         window.location.href = `https://z-lib.io/s/${a}?`;
//         // window.url(`https://www.freebookscity.com/${a}.html?language=EN`)
//     }

//     useEffect(() => {
//         const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
//         setCart(savedCart);
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }, [cart]);

//     return (
//         <div className="library-container">
//             <h2>Your Book Library</h2>
//             <div className="full">
//                 <div className="container">
//                     <h1>Book Search</h1>
//                     <button onClick={() => navigate('/cart', { state: { cart } })}>Cart</button>
//                     <form onSubmit={searchBooks}>
//                         <input
//                             type="text"
//                             value={query}
//                             onChange={(e) => setQuery(e.target.value)}
//                             placeholder="Search for books"
//                         />
//                         <button type="submit">Search</button>
//                     </form>
//                     <div className="book-list">
//                         {searchedBooks.map((book) => (
//                             <div key={book.id} className="book">
//                                 {book.volumeInfo.imageLinks ? (
//                                     <img
//                                         src={book.volumeInfo.imageLinks.thumbnail}
//                                         alt={`${book.volumeInfo.title} cover`}
//                                         className="book-image"
//                                     />
//                                 ) : (
//                                     <div className="no-image-placeholder">No Image Available</div>
//                                 )}
//                                 <h2>{book.volumeInfo.title}</h2>
//                                 <p>{book.volumeInfo.authors?.join(', ')}</p>
//                                 <button onClick={()=> handledownload(book.volumeInfo.title)}>download</button>
//                                 <button onClick={() => addToCart(book)}>Add to Cart</button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             <div className="book-actions">
//                 <button onClick={() => setIsAddingBook(!isAddingBook)}>
//                     {isAddingBook ? 'Cancel' : 'Add New Book'}
//                 </button>
//                 {isAddingBook && (
//                     <form
//                         onSubmit={editBook ? handleUpdateBook : handleAddBook}
//                     >
//                         <input
//                             type="text"
//                             placeholder="Title"
//                             value={newBook.title}
//                             onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Author"
//                             value={newBook.author}
//                             onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Category"
//                             value={newBook.category}
//                             onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
//                         />
//                         <button type="submit">{editBook ? 'Update Book' : 'Add Book'}</button>
//                     </form>
//                 )}
//             </div>
//             <div className="book-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Title</th>
//                             <th>Author</th>
//                             <th>Category</th>
//                             <th>Date Added</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     {/* <tbody>
//                         {filteredBooks.map((book) => (
//                             <tr key={book.id}>
//                                 <td>{book.title}</td>
//                                 <td>{book.author}</td>
//                                 <td>{book.category}</td>
//                                 <td>{new Date(book.date).toLocaleDateString()}</td>
//                                 <td>
//                                     <button onClick={() => handleEditBook(book)}>Edit</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody> */}
//                    <tbody>
//     {filteredBooks.map((book) => (
//         <tr key={book.id}>
//             <td>{book.title}</td>
//             <td>{book.author}</td>
//             <td>{book.category}</td>
//             <td>
//                 {book.date ? new Date(book.date).toLocaleDateString() : 'No Date Available'}
//             </td>
//             <td>
//                 <button onClick={() => handleEditBook(book)}>Edit</button>
//             </td>
//         </tr>
//     ))}
// </tbody>

//                 </table>
//             </div>
//             <div className="logout-button">
//                 <button onClick={logout}>Logout</button>
//             </div>
//         </div>
//     );
// }

// export default BookLibrary;
import React from 'react'

function BookLibrary() {
  return (
    <div>BookLibrary</div>
  )
}

export default BookLibrary