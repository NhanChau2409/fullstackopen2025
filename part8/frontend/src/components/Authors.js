import { useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHORS } from "../queries/authors";
import { useMemo, useState } from "react";
import Select from "react-select";

const AuthorList = ({ isVisible, onError }) => {
  const { data } = useQuery(ALL_AUTHORS);
  const authorData = data?.allAuthors || [];
  
  const [birthYear, setBirthYear] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  
  const [updateAuthorBirthYear] = useMutation(EDIT_AUTHORS, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const errorMessage = error.graphQLErrors[0]?.message || "An error occurred";
      onError(errorMessage);
    },
  });

  const authorOptions = useMemo(() => {
    return authorData.map((author) => ({
      value: author.name,
      label: author.name,
    }));
  }, [authorData]);

  if (!isVisible) {
    return null;
  }

  const handleBirthYearUpdate = async (event) => {
    event.preventDefault();
    
    if (!selectedAuthor) {
      onError("Please select an author");
      return;
    }

    try {
      await updateAuthorBirthYear({
        variables: {
          name: selectedAuthor.value,
          setBornTo: parseInt(birthYear),
        },
      });
      
      setBirthYear("");
      setSelectedAuthor(null);
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const renderAuthorTable = () => (
    <table className="author-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Birth Year</th>
          <th>Book Count</th>
        </tr>
      </thead>
      <tbody>
        {authorData.map((author) => (
          <tr key={author.name}>
            <td>{author.name}</td>
            <td>{author.born || "Unknown"}</td>
            <td>{author.bookCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderBirthYearForm = () => (
    <div className="birth-year-form">
      <h3>Update Author Birth Year</h3>
      <form onSubmit={handleBirthYearUpdate}>
        <div className="form-group">
          <label>Select Author:</label>
          <Select 
            value={selectedAuthor}
            onChange={setSelectedAuthor} 
            options={authorOptions}
            placeholder="Choose an author..."
          />
        </div>
        
        <div className="form-group">
          <label>Birth Year:</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="Enter birth year"
          />
        </div>
        
        <button type="submit" disabled={!selectedAuthor || !birthYear}>
          Update Birth Year
        </button>
      </form>
    </div>
  );

  return (
    <div className="authors-section">
      <h2>Author Directory</h2>
      {renderAuthorTable()}
      {renderBirthYearForm()}
    </div>
  );
};

export default AuthorList;
