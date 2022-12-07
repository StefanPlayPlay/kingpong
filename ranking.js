const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'hackathon-king-pong';
const COLLECTION_NAME = 'rankings';
const Arpad = require('arpad');
const elo = new Arpad();

const DEFAULT_RANKING_SCORE = 1_000;

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true
});

const updateRanking = async (winner, looser)=>{
    const winnerCurrentRating = await getCurrentRanking(winner);
    const looserCurrentRating = await getCurrentRanking(looser);

    const updatedWinnerRating = elo.newRatingIfWon(winnerCurrentRating,looserCurrentRating);
    const updatedLooserRating = elo.newRatingIfLost(looserCurrentRating, winnerCurrentRating);

    await updateUserRanking(winner, updatedWinnerRating);
    await updateUserRanking(looser, updatedLooserRating);
}

const getCurrentRanking = async (userId) => {
   const userRanking = await firestore.collection(COLLECTION_NAME).where('user_id', '==', userId).limit(1).get();

    if (userRanking.empty) {
        return DEFAULT_RANKING_SCORE;        
    }

    const rankingData = await userRanking.docs[0].data();
    return rankingData['ranking'];
}

const updateUserRanking = async (userId, ranking) => {
    const userRanking = await firestore.collection(COLLECTION_NAME).where('user_id', '==', userId).limit(1).get();

    if (userRanking.empty) {
        console.log(`Create a new ranking row for ${userId} with ${ranking}`);
        await firestore.collection(COLLECTION_NAME).add({
            user_id : userId,
            ranking,
        });     
    } else {
        console.log(`Update existing ranking row for ${userId} with ${ranking}`);
        const rankingData = await userRanking.docs[0].data();
        const docId = rankingData.id;
        console.log('docId', docId);
        console.log('userRanking.docs[0]', userRanking.docs[0]);
        console.log('userRanking.docs[0].id', userRanking.docs[0].id);
        await firestore.collection(COLLECTION_NAME).doc(userRanking.docs[0].id).update({
            ranking,
        });
    }
}

module.exports = {
    updateRanking
}