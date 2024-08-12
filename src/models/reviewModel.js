const { dbFirestore } = require("../config/firebase");

const reviewCollection = dbFirestore.collection("Reviews");

class Review {
    async createReview(reviewInfo, next) {
        try {
            const reviewRef = reviewCollection.doc();
            await reviewRef.set({
                ...reviewInfo,
                createdAt: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            });

            return reviewRef.id;
        } catch (error) {
            console.error("Error creating review:", error);
            next(error);
        }
    }

    async getReviewsByBookId(bookId, next) {
        try {
            const snapshot = await reviewCollection.where("bookID", "==", bookId).get();
            const reviews = [];
            snapshot.forEach(doc => {
                reviews.push({ id: doc.id, ...doc.data() });
            });
            return reviews;
        } catch (error) {
            console.error("Error getting reviews:", error);
            next(error);
        }
    }
}

module.exports = new Review();
