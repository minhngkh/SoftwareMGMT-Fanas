const { dbFirestore } = require("../config/firebase");

const bookCollection = dbFirestore.collection("Books");

class Book {
  async createNewBook(bookInfo, next) {
    try {
      const bookRef = bookCollection.doc();
      await bookRef.set({
        ...bookInfo,
        createdAt: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
      return bookRef.id;
    } catch (error) {
      console.error("Error creating book:", error);
      next(error);
    }
  }

  async getBookById(bookId, next) {
    try {
      const bookRef = await bookCollection.doc(bookId).get();
      if (bookRef.exists) {
        return { id: bookRef.id, ...bookRef.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting book:", error);
      next(error);
    }
  }

  async getAllBooks(next) {
    try {
      const snapshot = await bookCollection.get();
      const books = [];
      snapshot.forEach(doc => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return books;
    } catch (error) {
      console.error("Error getting books:", error);
      next(error);
    }
  }

  async countBooks(next) {
    try {
      const snapshot = await bookCollection.count().get()
      const totalBooks = snapshot.data().count;
      return totalBooks;
    } catch (error) {
      console.error("Error counting books:", error);
      next(error);
    }
  }

  async updateBook(bookId, bookInfo, next) {
    try {
      const bookRef = bookCollection.doc(bookId);
      await bookRef.update(bookInfo);
      return bookRef.id;
    } catch (error) {
      console.error("Error updating book:", error);
      next(error);
    }
  }

  async deleteBook(bookId, next) {
    try {
      await bookCollection.doc(bookId).delete();
    } catch (error) {
      console.error("Error deleting book:", error);
      next(error);
    }
  }

}

module.exports = new Book();
