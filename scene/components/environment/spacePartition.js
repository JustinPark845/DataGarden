export function partitionSpace(maxMapSize, variableData) {
    let row = Math.floor(Math.sqrt(variableData));
    let col = (variableData%row > 0) ? row + 1 : row;
    while (row*col < variableData) {col++;}
    let rowIncr = maxMapSize/row;
    let colIncr = maxMapSize/col;
    let rowMin = -maxMapSize/2;
    let colMin = -maxMapSize/2;
    let count = 0;
    let rangeSpace = {};
    for (let r = rowIncr - (maxMapSize/2); r <= maxMapSize/2; r+=rowIncr) {
        for (let c = colIncr - (maxMapSize/2); c <= maxMapSize/2; c+=colIncr) {
            rangeSpace[count] = {x: [rowMin, r], z: [colMin, c]}
            colMin = c;
            count++;
        }
        rowMin = r;
        colMin = -maxMapSize/2;
    }
    return rangeSpace;
}