import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/books";

const BookList = ({ isVisible }) => {
  const { data, loading, error } = useQuery(ALL_BOOKS);
  const bookCollection = data?.allBooks || [];

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error loading books: {error.message}</div>;
  }

  const renderBookTable = () => {
    if (bookCollection.length === 0) {
      return <p>No books available in the library.</p>;
    }

    return (
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {bookCollection.map((book) => (
            <tr key={`${book.title}-${book.author?.name || 'Unknown'}`}>
              <td>{book.title}</td>
              <td>{book.author?.name || 'Unknown Author'}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="books-section">
      <h2>Book Collection</h2>
      <div className="book-list">
        {renderBookTable()}
      </div>
    </div>
  );
};

export default BookList;
