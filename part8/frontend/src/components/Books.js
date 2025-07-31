import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries/books";

const BookList = ({ isVisible, selectedGenre, onGenreSelect }) => {
  const { data, loading, error } = useQuery(
    selectedGenre ? ALL_BOOKS_BY_GENRE : ALL_BOOKS,
    {
      variables: selectedGenre ? { genre: selectedGenre } : {},
    }
  );
  
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

  // Extract unique genres from all books
  const allGenres = [...new Set(bookCollection.flatMap(book => book.genres))].sort();

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
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {bookCollection.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author?.name || 'Unknown Author'}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderGenreButtons = () => {
    if (allGenres.length === 0) {
      return null;
    }

    return (
      <div className="genre-buttons">
        <h3>Filter by Genre:</h3>
        <div className="genre-button-container">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreSelect(genre)}
              className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
            >
              {genre}
            </button>
          ))}
          {selectedGenre && (
            <button
              onClick={() => onGenreSelect(null)}
              className="genre-button clear-button"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="books-section">
      <h2>
        Book Collection
        {selectedGenre && ` - ${selectedGenre}`}
      </h2>
      <div className="book-list">
        {renderBookTable()}
      </div>
      {renderGenreButtons()}
    </div>
  );
};

export default BookList;
