import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BOOK, ALL_BOOKS } from "../queries/books";
import { ALL_AUTHORS } from "../queries/authors";

const BookForm = ({ isVisible, onError }) => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    published: "",
  });
  const [currentGenre, setCurrentGenre] = useState("");
  const [genreList, setGenreList] = useState([]);

  const [addNewBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      onError(error.graphQLErrors[0]?.message || "Failed to add book");
    },
    onCompleted: () => {
      // Reset form on success
      setBookData({
        title: "",
        author: "",
        published: "",
      });
      setCurrentGenre("");
      setGenreList([]);
      onError("Book added successfully!");
    },
  });

  if (!isVisible) {
    return null;
  }

  const handleInputChange = (field, value) => {
    setBookData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();

    if (genreList.length === 0) {
      onError("At least one genre is required");
      return;
    }

    try {
      await addNewBook({
        variables: {
          title: bookData.title,
          author: bookData.author,
          published: parseInt(bookData.published),
          genres: genreList,
        },
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const addGenreToList = () => {
    if (currentGenre.trim() && !genreList.includes(currentGenre.trim())) {
      setGenreList(prev => [...prev, currentGenre.trim()]);
      setCurrentGenre("");
    }
  };

  const removeGenre = (genreToRemove) => {
    setGenreList(prev => prev.filter(genre => genre !== genreToRemove));
  };

  const renderGenreSection = () => (
    <div className="genre-section">
      <div className="genre-input">
        <input
          type="text"
          value={currentGenre}
          onChange={(e) => setCurrentGenre(e.target.value)}
          placeholder="Enter genre"
          onKeyPress={(e) => e.key === 'Enter' && addGenreToList()}
        />
        <button type="button" onClick={addGenreToList}>
          Add Genre
        </button>
      </div>
      
      {genreList.length > 0 && (
        <div className="genre-list">
          <label>Genres:</label>
          <div className="genre-tags">
            {genreList.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
                <button 
                  type="button" 
                  onClick={() => removeGenre(genre)}
                  className="remove-genre"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="book-form-section">
      <h2>Add New Book</h2>
      <form onSubmit={handleFormSubmission} className="book-form">
        <div className="form-field">
          <label htmlFor="title">Book Title:</label>
          <input
            id="title"
            type="text"
            value={bookData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            value={bookData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="published">Publication Year:</label>
          <input
            id="published"
            type="number"
            value={bookData.published}
            onChange={(e) => handleInputChange('published', e.target.value)}
            required
          />
        </div>

        {renderGenreSection()}

        <button type="submit" className="submit-button" disabled={genreList.length === 0}>
          Add Book to Library
        </button>
      </form>
    </div>
  );
};

export default BookForm;
