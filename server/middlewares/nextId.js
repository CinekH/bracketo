export const nextId = (currentId, length) => {
    const roundLength = term(currentId, length);
    const roundStart = firstMatchInRound(currentId, length);
    return roundStart + roundLength + Math.floor((currentId - roundStart) / 2)  ;
} 

const term = (a, b) => {
    if(a - b < 0) return b;
    return term(a - b, b/2);
}

const firstMatchInRound = (a, b) => {
    let roundNumber = 0;
    let roundStart = 0;
    let continueLoop = true;
    while(continueLoop) {
        roundNumber++;
        roundStart = Math.pow(2, Math.log2(b * 2) - roundNumber) * (Math.pow(2, roundNumber) - 2);
        const roundEnd = Math.pow(2, Math.log2(b * 2) - (roundNumber + 1)) * (Math.pow(2, roundNumber + 1) - 2);
        if(a >= roundStart && a < roundEnd ) {
            continueLoop = false;
        }   
    }
    return roundStart;
}