
export const getUserInputCells = (puzzle) => {
    let cells = [];
    for (let r = 0; r < puzzle.length; r++) {
        for (let c = 0; c < puzzle[r].length; c++) {
            if (puzzle[r][c].isDisabled) continue;
            cells.push(puzzle[r][c]);
        }
    }
    return cells;
};

const rowValidation = (cell, grid) => {
    let row = cell.row;
    for(let col = 0; col < 9; col ++) {
        const gridItem = grid[row][col];
        if(cell.id === gridItem.id) continue;
        if(parseInt(cell.value) === gridItem.value) {
            return false;
        } 
    }
    return true;
};

const colValidation = (cell, grid) => {
    const col = cell.col;
    for(let row = 0; row < 9; row ++) {
        const gridItem = grid[row][col];
        if(cell.id === gridItem.id || gridItem.value === 0) continue;
        if(parseInt(cell.value) === gridItem.value){
            return false;
        } 
    }
    return true;

};

const gridValidation = (cell, grid) => {
    const col = cell.col, row =  cell.row;
    let minCol, maxCol, minRow, maxRow;
    if(col < 3) { minCol = 0; maxCol = 3}
    if(col > 2 && col < 6) { minCol = 3; maxCol = 6}
    if(col > 5 && col < 9) { minCol = 6; maxCol = 9}
    if(row < 3) { minRow = 0; maxRow = 3}
    if(row > 2 && row < 6) { minRow = 3; maxRow = 6}
    if(row > 5 && row < 9) { minRow = 6; maxRow = 9}
    for (let i = minRow; i < maxRow; i++){
        for(let j = minCol; j < maxCol; j++){
            const gridItem = grid[i][j];
            if(cell.id === gridItem.id || gridItem.value === 0) continue;
            if(parseInt(cell.value) === gridItem.value){
                return false;
            } 
        }
    }
    return true
};

export const gridValidator = (cell, grid) => {
    const isRowValid = rowValidation(cell, grid);
    const isColValid = colValidation(cell, grid);
    const isGridValid = gridValidation(cell, grid);
    const isNumberValid = (cell.value > 0 && cell.value < 10);
    return !(!isRowValid || !isColValid || !isGridValid || !isNumberValid);
};
