let gameOver = new Audio('Game-over.mp3');
let gameWin = new Audio('Game-win.mp3');

// Main function starting
function passValues() {

    // Creating 2D array 9x9
    var arr = new Array(9);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(9);
    }

    // Inserting all '0' in 81 cells
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j] = 0;
        }
    }

    // Generating random value upto 50 cells
    var a = 30;
    while (a--) {
        var x = Math.floor(Math.random() * 9);
        var myStringx = x.toString();

        var y = Math.floor(Math.random() * 9);
        var myStringy = y.toString();

        var el = Math.floor(Math.random() * 9) + 1;
        var myStringEl = el.toString();

        let temp = "a";
        let result = temp.concat(myStringx);
        result = result.concat(myStringy);
        //console.log(result);

        if (canBeInserted2(x, y, el, arr)) {
            document.getElementById(result).innerHTML = myStringEl;
            arr[x][y] = el;
        }
    }

    for (var i = 0; i < 9; i++) {
        var indi = i.toString();
        for (var j = 0; j < 9; j++) {
            var indj = j.toString();
            let temp = "a";
            let result = temp.concat(indi);
            result = result.concat(indj);

            if (arr[i][j] !== 0) {
                document.getElementById(result).style.backgroundColor = 'rgb(5, 5, 5)';
            } else {
                document.getElementById(result).style.backgroundColor = 'rgb(94, 96, 109)';
            }
        }
    }

    setTimeout(function () {
        // Creating a dublicate array to check if the sudoku can be solved
        var copy = new Array(9);
        for (var i = 0; i < copy.length; i++) {
            copy[i] = new Array(9);
        }

        // Copying all elements from main array
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                copy[i][j] = arr[i][j];
            }
        }

        // Checking in "COPY" array if the current array be a perfect sudoku if possible
        // then call the "MAIN" array backtracking and solving the sudoku..
        if (solve1(copy)) {
            document.getElementById("msg").innerHTML = "Your puzzle is solving...";
            document.getElementById("msg").style.color = "orange";
            console.log("Your puzzle is solving...");
            solve2(arr);
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    console.log(arr[i][j]);
                }
            }
        } else {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    var indi = i.toString();
                    var indj = j.toString();
                    let temp = "a";
                    let result = temp.concat(indi);
                    result = result.concat(indj);
                    if (copy[i][j] == 0) {
                        document.getElementById(result).style.backgroundColor = 'red';
                    }
                }
            }
            gameOver.play();
            document.getElementById("msg").innerHTML = "This puzzle can't be solved. Please refresh the board...";
            document.getElementById("msg").style.color = "red";
            console.log("This puzzle can't be solved...");
        }
    }, 2000);
    document.getElementById("msg").innerHTML = "Checking if the puzzle can be solved or not...";
    document.getElementById("msg").style.color = "yellow";

}


// Backtracking in "COPY" array to check if the current array can be solved
function solve1(copy) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (copy[i][j] == 0) {
                for (let b = 1; b < 10; b++) {
                    if (canBeInserted1(i, j, b, copy)) {
                        copy[i][j] = b;
                        if (solve1(copy)) {
                            return true;
                        } else {
                            copy[i][j] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}


// Backtracking in "MAIN" array and filling the sudoku
let time = 0;
let step = 0;
function solve2(arr) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (arr[i][j] == 0) {
                for (let b = 1; b < 10; b++) {
                    if (canBeInserted2(i, j, b, arr)) {
                        step++;
                        var indi = i.toString();
                        var indj = j.toString();
                        let temp = "a";
                        let result = temp.concat(indi);
                        result = result.concat(indj);
                        var strb = b.toString();
                        setTimeout(function () {
                            document.getElementById(result).innerHTML = strb;
                            document.getElementById(result).style.backgroundColor = 'green';
                            if (result === "a88") {
                                gameWin.play();
                                document.getElementById("msg").innerHTML = "Your puzzle is solved... (-_-)";
                                document.getElementById("msg").style.color = "rgb(0, 255, 38)";
                                console.log("Your puzzle is solved... (-_-)");
                                let xx = step.toString();
                                let op = "Solved in ";
                                op = op + xx;
                                op = op + " operations."
                                document.getElementById("steps").innerHTML = op;
                                document.getElementById("steps").style.color = "orange";
                            }
                        }, time);
                        time = time + 2;
                        arr[i][j] = b;
                        if (solve2(arr)) {
                            return true;
                        } else {
                            setTimeout(function () {
                                document.getElementById(result).innerHTML = "";
                                document.getElementById(result).style.backgroundColor = 'rgb(94, 96, 109)';
                            }, time);
                            time = time + 1;
                            arr[i][j] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}


// Checking if that element is not present in that row and in
// that column and in that 3x3 block where that element belongs
// in "COPY" array
function canBeInserted1(row, col, item, copy) {
    for (var k = 0; k < 9; k++) {
        // checking row
        if (copy[row][k] == item) {
            return false;
        }
        // checking column
        if (copy[k][col] == item) {
            return false;
        }
        // checking the 3x3 matrix where the item belongs to
        let temp00 = Math.floor(row / 3);
        let temp01 = Math.floor(col / 3);
        let temp1 = Math.floor(k / 3);
        let temp2 = Math.floor(k % 3);
        let cubeCheckX = Math.floor(3 * temp00 + temp1);
        let cubeCheckY = Math.floor(3 * temp01 + temp2);
        if (copy[cubeCheckX][cubeCheckY] == item) {
            return false;
        }
    }
    return true;
}

// Checking if that element is not present in that row and in
// that column and in that 3x3 block where that element belongs
// in "MAIN" array
function canBeInserted2(row, col, item, arr) {
    for (var k = 0; k < 9; k++) {
        // checking row
        if (arr[row][k] == item) {
            return false;
        }
        // checking column
        if (arr[k][col] == item) {
            return false;
        }
        // checking the 3x3 matrix where the item belongs to
        let temp00 = Math.floor(row / 3);
        let temp01 = Math.floor(col / 3);
        let temp1 = Math.floor(k / 3);
        let temp2 = Math.floor(k % 3);
        let cubeCheckX = Math.floor(3 * temp00 + temp1);
        let cubeCheckY = Math.floor(3 * temp01 + temp2);
        if (arr[cubeCheckX][cubeCheckY] == item) {
            return false;
        }
    }
    return true;
}