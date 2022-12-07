const Arpad = require('arpad');

const elo = new Arpad();

const updateRanking = (winner, looser)=>{
    const winnerCurrentRating = 1200;
    const looserCurrentRating = 1250;
    const updatedWinnerRating = elo.newRatingIfWon(winnerCurrentRating,looserCurrentRating);
    const updatedLooserRating = elo.newRatingIfLost(looserCurrentRating, winnerCurrentRating);
    console.log(`winner went from ${winnerCurrentRating} to ${updatedWinnerRating}`),
    console.log(`winner went from ${looserCurrentRating} to ${updatedLooserRating}`);
}

modules.exports = {
    updateRanking
}