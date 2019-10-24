export const generatePuzzle = (difficulty) => {
    let values = [1,2,3,4,5,6,7,8,9];
    const puzzle = definePuzzleGrid();
    while (values.length > 0){
        populatePuzzle(puzzle, values, values.shift());
    }
    setDifficulty(puzzle, difficulty);
    return puzzle;
};

const setDifficulty = (puzzle, difficulty) => {
    let _difficulty = difficulty;
    while(_difficulty > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if(puzzle[row][col].value === 0) continue;
        puzzle[row][col].value = 0;
        puzzle[row][col].isDisabled = false;
        _difficulty --
    }

};

const definePuzzleGrid = () => {
    let puzzle = [];
    for (let row = 0; row < 9; row++) {
        puzzle.push([]);
        for (let col = 0; col < 9; col++) {
            const gridRow = Math.floor(row/3);
            const gridCol = Math.floor(col/3);
            const gridIndex = gridRow * 3 + gridCol;
            puzzle[row].push({
                isDisabled: true,
                isHighlighted: false,
                row: row, 
                col: col, 
                id: row + '_' +col,
                grid: gridIndex, 
                value: 0
            });
        }
    }
    return puzzle;
};

const gridSectionRef = (puzzle) => {
    var _gridsRef = [[],[],[], [],[],[], [],[],[]];
    for(var r = 0; r < 9; r ++){
        for (var c = 0; c < 9; c++){
            var gridRow = Math.floor(r/3);
            var gridCol = Math.floor(c/3);
            var gridIndex = gridRow * 3 + gridCol;
            _gridsRef[gridIndex].push(puzzle[r][c]);
        }
    }
    return _gridsRef;
};

const populatePuzzle = (puzzle, values, value) => {
    const _gridsRef = gridSectionRef(puzzle);

    for (var g = 0; g < 9; g++){
        let loop = true;
        let elements = [0,1,2,3,4,5,6,7,8];

        while(loop){
            let exhaustedAllElements = (elements.length === 0);
            if(exhaustedAllElements){
                return backTrack(value, puzzle, values);
            }
            var element = elements[Math.floor(Math.random()*elements.length)];
            var item = _gridsRef[g][element];
            var index = elements.indexOf(element);
            if(item.value > 0){
                elements.splice(index,1);
                continue;
            }
            var rowValid = isRowValid(item.row, value, puzzle);
            var colValid = isColValid(item.col, value, puzzle);
            if(rowValid && colValid) {
                puzzle[item.row][item.col].value = value;
                loop = false;
            } else {
                elements.splice(index,1);
            }
        }
    }
    return puzzle;
};

const backTrack = (value, puzzle, values) => {
    let currentValue = value, previousValue = value-1;
    for (var row = 0; row < puzzle.length; row ++) {
        for(var col = 0; col < puzzle[row].length; col++){
            if (puzzle[row][col].value !== currentValue && puzzle[row][col].value !== previousValue) continue;
                puzzle[row][col].value = 0;
        }
    }
    values.unshift(previousValue, currentValue);
};

const isRowValid = (row, value, puzzle) => {
    for(var c = 0; c < 9; c++){
        if(value === puzzle[row][c].value) return false;
    }
    return true
};

const isColValid = (col, value, puzzle) => {
    for(var r = 0; r < 9; r++){
        if(value === puzzle[r][col].value) return false;
    }
    return true
};
