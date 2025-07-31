import { useState } from "react";
import { useQuery } from "@apollo/client";
import AuthorList from "./components/Authors";
import BookList from "./components/Books";
import BookForm from "./components/NewBook";
import Login from "./components/Login";
import { Notification } from "./components/Notify";
import { ME } from "./queries/users";

const LibraryApp = () => {
  const [currentView, setCurrentView] = useState("authors");
  const [notification, setNotification] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("library-user-token"));
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  const { data: userData } = useQuery(ME, {
    skip: !token,
  });
  
  const displayMessage = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };
  
  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === "books") {
      setSelectedGenre(null);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    setCurrentView("authors");
    setSelectedGenre(null);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
  };

  const handleRecommendations = () => {
    if (userData?.me?.favoriteGenre) {
      setSelectedGenre(userData.me.favoriteGenre);
      setCurrentView("books");
    }
  };

  if (!token) {
    return (
      <div className="library-container">
        <Notification message={notification} />
        <Login setToken={setToken} onError={displayMessage} />
      </div>
    );
  }

  return (
    <div className="library-container">
      <Notification message={notification} />
      
      <nav className="navigation">
        <button onClick={() => handleNavigation("authors")}>Authors</button>
        <button onClick={() => handleNavigation("books")}>Books</button>
        <button onClick={() => handleNavigation("add")}>Add Book</button>
        {userData?.me && (
          <button onClick={handleRecommendations}>Recommendations</button>
        )}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <main className="content">
        <AuthorList 
          isVisible={currentView === "authors"} 
          onError={displayMessage} 
        />
        <BookList 
          isVisible={currentView === "books"} 
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />
        <BookForm isVisible={currentView === "add"} onError={displayMessage} />
      </main>
    </div>
  );
};

export default LibraryApp;
