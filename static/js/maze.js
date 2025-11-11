const MazeRenderer = {
    mazeGrid: null,
    character: null,

    init() {
        this.mazeGrid = document.getElementById('maze-grid');
    },

    render(mazeData) {
        if (!this.mazeGrid) return;

        this.mazeGrid.innerHTML = '';

        const size = mazeData.size;
        const maxSize = 400;
        const cellSize = Math.floor(maxSize / size);

        this.mazeGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
        this.mazeGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;

        const emojiSize = Math.floor(cellSize * 0.7);
        document.documentElement.style.setProperty('--cell-emoji-size', `${emojiSize}px`);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (mazeData.grid[y][x] === 1) {
                    cell.classList.add('wall');
                } else {
                    cell.classList.add('path');
                }

                if (x === mazeData.start.x && y === mazeData.start.y) {
                    cell.classList.add('start');
                }

                if (x === mazeData.goal.x && y === mazeData.goal.y) {
                    cell.classList.add('goal');
                }

                const obstacle = mazeData.obstacles?.find(obs => obs.x === x && obs.y === y);
                if (obstacle) {
                    cell.classList.add('obstacle');
                    cell.dataset.obstacleType = obstacle.type;
                    const obstacleSpan = document.createElement('span');
                    obstacleSpan.className = 'obstacle-icon';
                    obstacleSpan.textContent = obstacle.type;
                    cell.appendChild(obstacleSpan);
                }

                this.mazeGrid.appendChild(cell);
            }
        }

        this.placeCharacter(mazeData.start.x, mazeData.start.y, 0);
    },

    placeCharacter(x, y, direction) {
        if (this.character) {
            this.character.remove();
        }

        const cell = this.getCell(x, y);
        if (!cell) return;

        this.character = document.createElement('div');
        this.character.className = `character direction-${direction}`;
        cell.appendChild(this.character);
    },

    updateCharacter(x, y, direction) {
        if (!this.character) return;

        const cell = this.getCell(x, y);
        if (!cell) return;

        cell.appendChild(this.character);

        this.character.className = `character direction-${direction}`;
    },

    getCell(x, y) {
        return this.mazeGrid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    },

    addCharacterClass(className) {
        if (this.character) {
            this.character.classList.add(className);
        }
    },

    removeCharacterClass(className) {
        if (this.character) {
            this.character.classList.remove(className);
        }
    },

    clear() {
        if (this.mazeGrid) {
            this.mazeGrid.innerHTML = '';
        }
        this.character = null;
    }
};
