const { dbFirestore, admin } = require("../config/firebase");

const authorCollection = dbFirestore.collection("Authors");

class Author {
    async createNewAuthor(authorInfo, next) {
        const { avatarPath, name, description, bookList } = authorInfo;
        const fullAuthorInfo = {
            avatarPath,
            name,
            description,
            bookList,
            createdAt: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
        try {
            const authorRef = authorCollection.doc();
            await authorRef.set(fullAuthorInfo);
        } catch (error) {
            console.error("Error creating author:", error);
            next(error);
        }
    }

    async getAllAuthors(next) {
        try {
            const snapshot = await authorCollection.get();
            const authors = [];
            snapshot.forEach(doc => {
                authors.push({ id: doc.id, ...doc.data() });
            });
            return authors;
        } catch (error) {
            console.error("Error getting authors:", error);
            next(error);
        }
    }

    async getAuthorById(authorId) {
        try {
            const authorDoc = await authorCollection.doc(authorId).get();
            if (authorDoc.exists) {
                return { id: authorDoc.id, ...authorDoc.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting author:", error);
            throw error;
        }
    }

    async addBookToAuthor(authorId, bookId) {
        try {
            const authorRef = authorCollection.doc(authorId);
            await authorRef.update({
                bookList: admin.firestore.FieldValue.arrayUnion(bookId)
            });
        } catch (error) {
            console.error("Error adding book to author:", error);
            throw error;
        }
    }
    
    async removeBookFromAuthor(authorId, bookId) {
        try {
            const authorRef = authorCollection.doc(authorId);
            await authorRef.update({
                bookList: admin.firestore.FieldValue.arrayRemove(bookId)
            });
        } catch (error) {
            console.error("Error removing book from author:", error);
            throw error;
        }
    }

    async countAuthors(next) {
        try {
            const snapshot  = await authorCollection.count().get()
            const totalAuthors = snapshot.data().count;
            return totalAuthors;
        } catch (error) {
            console.error("Error counting authors:", error);
            next(error);
        }
    }
}

module.exports = new Author;
