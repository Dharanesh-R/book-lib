// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Admin() {
//     const [books, setBooks] = useState([]);
//     const [title, setTitle] = useState('');
//     const [author, setAuthor] = useState('');
//     const [category, setCategory] = useState('');
//     const [image, setImage] = useState(null);
//     const [editBookId, setEditBookId] = useState(null);

//     useEffect(() => {
//         fetchBooks();
//     }, []);

//     const fetchBooks = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/books');
//             setBooks(response.data);
//         } catch (error) {
//             console.error('Error fetching books:', error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('author', author);
//         formData.append('category', category);
//         if (image) {
//             formData.append('image', image);
//         }

//         try {
//             if (editBookId) {
//                 await axios.put(`http://localhost:5000/books/${editBookId}`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 setEditBookId(null);
//             } else {
//                 await axios.post('http://localhost:5000/books', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//             }
//             setTitle('');
//             setAuthor('');
//             setCategory('');
//             setImage(null);
//             fetchBooks();
//         } catch (error) {
//             console.error('Error adding/updating book:', error);
//         }
//     };

//     const handleEdit = (book) => {
//         setEditBookId(book._id);
//         setTitle(book.title);
//         setAuthor(book.author);
//         setCategory(book.category);
//         setImage(book.image);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/books/${id}`);
//             fetchBooks();
//         } catch (error) {
//             console.error('Error deleting book:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Admin Panel</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Book Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="text"
//                     placeholder="Author"
//                     value={author}
//                     onChange={(e) => setAuthor(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="text"
//                     placeholder="Category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setImage(e.target.files[0])}
//                     required
//                 />
//                 <button type="submit">{editBookId ? 'Update Book' : 'Add Book'}</button>
//             </form>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Title</th>
//                         <th>Author</th>
//                         <th>Category</th>
//                         <th>Image</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {books.map(book => (
//                         <tr key={book._id}>
//                             <td>{book.title}</td>
//                             <td>{book.author}</td>
//                             <td>{book.category}</td>
//                             <td>
//                                 <img src={`http://localhost:5000/${book.image.replace(/\\/g, '/')}`} alt={book.title} style={{ width: '50px' }} />
//                             </td>
//                             <td>
//                                 <button onClick={() => handleEdit(book)}>Update</button>
//                                 <button onClick={() => handleDelete(book._id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default Admin;









import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [editBookId, setEditBookId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (editBookId) {
                await axios.put(`http://localhost:5000/books/${editBookId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setEditBookId(null);
            } else {
                await axios.post('http://localhost:5000/books', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            setTitle('');
            setAuthor('');
            setCategory('');
            setImage(null);
            fetchBooks();
        } catch (error) {
            console.error('Error adding/updating book:', error);
        }
    };

    const handleEdit = (book) => {
        setEditBookId(book._id);
        setTitle(book.title);
        setAuthor(book.author);
        setCategory(book.category);
        setImage(book.image);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    // Filtered books based on search and category
    const filteredBooks = books.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
        return matchesTitle && matchesCategory;
    });

    return (
        <div>
            <h2>Admin Panel</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Book Title:
                    <input
                        type="text"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Author:
                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </label>
                <button type="submit">{editBookId ? 'Update Book' : 'Add Book'}</button>
            </form>

            <div>
                <input
                    type="text"
                    placeholder="Search by Title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    Filter by Category:
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {Array.from(new Set(books.map(book => book.category))).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map(book => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>
                                <img src={`http://localhost:5000/${book.image.replace(/\\/g, '/')}`} alt={book.title} style={{ width: '50px' }} />
                            </td>
                            <td>
                                <button onClick={() => handleEdit(book)}>Update</button>
                                <button onClick={() => handleDelete(book._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
