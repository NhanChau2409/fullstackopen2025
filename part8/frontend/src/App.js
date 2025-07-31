import { useState } from "react";
import AuthorList from "./components/Authors";
import BookList from "./components/Books";
import BookForm from "./components/NewBook";
import { Notification } from "./components/Notify";

const LibraryApp = () => {
  const [currentView, setCurrentView] = useState("authors");
  const [notification, setNotification] = useState(null);
  
  const displayMessage = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };
  
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="library-container">
      <Notification message={notification} />
      
      <nav className="navigation">
        <button onClick={() => handleNavigation("authors")}>Authors</button>
        <button onClick={() => handleNavigation("books")}>Books</button>
        <button onClick={() => handleNavigation("add")}>Add Book</button>
      </nav>

      <main className="content">
        <AuthorList 
          isVisible={currentView === "authors"} 
          onError={displayMessage} 
        />
        <BookList isVisible={currentView === "books"} />
        <BookForm isVisible={currentView === "add"} />
      </main>
    </div>
  );
};

export default LibraryApp;
