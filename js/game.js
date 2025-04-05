document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const highestDidplay = document.getElementById('highest');
    const width = 8;
    const squares = [];
    let score = 0;
    let colorBeginDrag;
    let colorBeginReplaced;
    let squareIdBeginDrag;
    let squareIdBeginReplaced;
    let time = 180;
    let highestScore = localStorage.getItem('highestScore') || 0;



    const candyColors = [
        'url(../images/red-candy.png)',
        'url(../images/blue-candy.png)',
        'url(../images/green-candy.png)',
        'url(../images/orange-candy.png)',
        'url(../images/yellow-candy.png)',
        'url(../images/purple-candy.png)'
    ];
    const AudioArr = [
        new Audio('../audio/s1.mp3'),
        new Audio('../audio/s2.mp3'),
        new Audio('../audio/s3.mp3'),
        new Audio('../audio/s4.mp3')
    ];

    function createBoard() {

        for (let i = 0; i < width * width; i++) {

            const square = document.createElement('div');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);

        }
        highestDidplay.innerHTML = highestScore;
    }
    createBoard();
    const timer = setInterval(() => {
        time--;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(timer);
            if (score > highestScore) {
                highestScore = score;
                localStorage.setItem('highestScore', highestScore);
                window.location.href = '../html/victory.html';
            } else {
                localStorage.setItem('userScore', score);
                window.location.href = '../html/gameOver.html';
            }
        }
    }, 1000);

    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('dragenter', dragEnter);
        square.addEventListener('drop', dragDrop);
        square.addEventListener('dragend', dragEnd);
    });

    function dragStart() {
        colorBeginDrag = this.style.backgroundImage;
        squareIdBeginDrag = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragDrop() {
        colorBeginReplaced = this.style.backgroundImage;
        squareIdBeginReplaced = parseInt(this.id);
        squares[squareIdBeginDrag].style.backgroundImage = colorBeginReplaced;
        this.style.backgroundImage = colorBeginDrag;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeginDrag - 1,
            squareIdBeginDrag + 1,
            squareIdBeginDrag - width,
            squareIdBeginDrag + width
        ];
        let validMove = validMoves.includes(squareIdBeginReplaced);

        if (squareIdBeginReplaced && validMove) {

            squares[squareIdBeginDrag].style.backgroundImage = colorBeginReplaced;
            squares[squareIdBeginReplaced].style.backgroundImage = colorBeginDrag;
            let isValidSwap = checkForMatches();
            if (!isValidSwap) {

                squares[squareIdBeginReplaced].style.backgroundImage = colorBeginReplaced;
                squares[squareIdBeginDrag].style.backgroundImage = colorBeginDrag;
            } else {
                window.setTimeout(() => {
                    moveDown();
                    checkRowForFive();
                    checkColumnForFive();
                    checkRowForFour();
                    checkColumnForFour();
                    checkRowForThree();
                    checkColumnForThree();
                }, 100);
            }
        } else if (squareIdBeginReplaced && !validMove) {

            squares[squareIdBeginReplaced].style.backgroundImage = colorBeginReplaced;
            squares[squareIdBeginDrag].style.backgroundImage = colorBeginDrag;
        } else {
            squares[squareIdBeginDrag].style.backgroundImage = colorBeginDrag;
        }
    }

    function checkForMatches() {
        let hasMatch = false;

        for (let i = 0; i < 62; i++) {
            let rowForThree = [i, i + 1, i + 2];
            let rowForFour = [i, i + 1, i + 2, i + 3];
            let rowForFive = [i, i + 1, i + 2, i + 3, i + 4];

            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

            if (notValid.includes(i)) continue;

            if (rowForFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }

            if (rowForFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }

            if (rowForThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }
        }

        for (let i = 0; i < 48; i++) {
            let columnForThree = [i, i + width, i + width * 2];
            let columnForFour = [i, i + width, i + width * 2, i + width * 3];
            let columnForFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];

            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';

            if (columnForFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }

            if (columnForFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }

            if (columnForThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                hasMatch = true;
                break;
            }
        }

        return hasMatch;
    }

    function moveDown() {
        for (let i = 0; i < 56; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i].style.backgroundImage === '') {
                const randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    function checkRowForThree() {
        for (let i = 0; i < 62; i++) {
            let rowForThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue;
            if (rowForThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                rowForThree.forEach(index => squares[index].style.backgroundImage = '');
                score += 3;
                scoreDisplay.innerHTML = score;
                AudioArr[0].play();
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 48; i++) {
            let columnForThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            if (columnForThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                columnForThree.forEach(index => squares[index].style.backgroundImage = '');
                score += 3;
                scoreDisplay.innerHTML = score;
                AudioArr[1].play();
            }
        }
    }

    function checkRowForFour() {
        for (let i = 0; i < 61; i++) {
            let rowForFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if (notValid.includes(i)) continue;
            if (rowForFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                rowForFour.forEach(index => squares[index].style.backgroundImage = '');
                score += 4;
                scoreDisplay.innerHTML = score;
                AudioArr[2].play();
            }
        }
    }

    function checkColumnForFour() {
        for (let i = 0; i < 40; i++) {
            let columnForFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            if (columnForFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                columnForFour.forEach(index => squares[index].style.backgroundImage = '');
                score += 4;
                scoreDisplay.innerHTML = score;
                AudioArr[3].play();
            }
        }
    }

    function checkRowForFive() {
        for (let i = 0; i < 60; i++) {
            let rowForFive = [i, i + 1, i + 2, i + 3, i + 4];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55];
            if (notValid.includes(i)) continue;
            if (rowForFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {

                rowForFive.forEach(index => squares[index].style.backgroundImage = '');
                score += 10;
                scoreDisplay.innerHTML = score;
                AudioArr[2].play();
            }
        }
    }

    function checkColumnForFive() {
        for (let i = 0; i < 32; i++) {
            let columnForFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            let decidedColor = squares[i].style.backgroundImage;
            let isBlank = squares[i].style.backgroundImage === '';
            if (columnForFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {

                columnForFive.forEach(index => squares[index].style.backgroundImage = '');
                score += 10;
                scoreDisplay.innerHTML = score;
                AudioArr[3].play();
            }
        }
    }



    window.setInterval(function () {
        moveDown();
        checkRowForFive();
        checkColumnForFive();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
    }, 100);
});
