export const arrayShuffle = (arr) => {
    let index = arr.length;
    while (--index > 0) {
        let randomIndex = Math.floor(Math.random() * (index + 1));
        [arr[randomIndex], arr[index]] = [arr[index], arr[randomIndex]];
    }
    return arr;
}