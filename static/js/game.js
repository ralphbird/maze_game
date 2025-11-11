const Game = {
    maze: null,
    character: {
        x: 0,
        y: 0
    },
    difficulty: 1,
    isExecuting: false,

    async init() {
        MazeRenderer.init();
        InstructionManager.init();

        this.setupDifficultySelector();
        this.setupGameButtons();
        this.setupKeyboardControls();
    },

    setupDifficultySelector() {
        const buttons = document.querySelectorAll('.difficulty-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const difficulty = parseInt(button.dataset.difficulty);
                this.startNewGame(difficulty);
            });
        });
    },

    setupGameButtons() {
        const goButton = document.getElementById('btn-go');
        goButton.addEventListener('click', () => {
            this.executeInstructions();
        });

        const clearButton = document.getElementById('btn-clear');
        clearButton.addEventListener('click', () => {
            this.clearAll();
        });

        const backButton = document.getElementById('btn-back');
        backButton.addEventListener('click', () => {
            this.showDifficultySelector();
        });

        const newMazeButton = document.getElementById('btn-new-maze');
        newMazeButton.addEventListener('click', () => {
            this.showDifficultySelector();
        });
    },

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.isExecuting || !this.maze) return;

            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    document.getElementById('btn-up').click();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    document.getElementById('btn-down').click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    document.getElementById('btn-left').click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    document.getElementById('btn-right').click();
                    break;
                case 'Enter':
                    e.preventDefault();
                    document.getElementById('btn-go').click();
                    break;
                case 'Escape':
                    e.preventDefault();
                    document.getElementById('btn-clear').click();
                    break;
            }
        });
    },

    async startNewGame(difficulty) {
        this.difficulty = difficulty;
        this.hideDifficultySelector();

        try {
            const response = await fetch('/api/maze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ difficulty: difficulty })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch maze');
            }

            this.maze = await response.json();
            this.character = {
                x: this.maze.start.x,
                y: this.maze.start.y
            };

            InstructionManager.clear();
            MazeRenderer.render(this.maze);

            document.getElementById('maze-container').style.display = 'flex';
            document.getElementById('btn-new-maze').style.display = 'none';
        } catch (error) {
            console.error('Error loading maze:', error);
            alert('Failed to load maze. Please try again.');
        }
    },

    executeInstructions() {
        if (this.isExecuting || !this.maze) return;

        const instructions = InstructionManager.getInstructions();
        if (instructions.length === 0) return;

        this.isExecuting = true;
        this.disableControls();

        Animator.executeInstructions(
            instructions,
            this.character,
            this.maze,
            (result) => {
                this.handleExecutionResult(result);
            }
        );
    },

    handleExecutionResult(result) {
        this.isExecuting = false;

        if (result.success) {
            this.showSuccessMessage();
            this.character.x = result.x;
            this.character.y = result.y;
        } else if (result.type === 'wall' || result.type === 'obstacle') {
            this.showErrorMessage();
            setTimeout(() => {
                this.resetCharacterPosition();
            }, 2000);
        } else if (result.type === 'incomplete') {
            setTimeout(() => {
                this.resetCharacterPosition();
            }, 2000);
        } else {
            this.enableControls();
        }
    },

    showErrorMessage() {
        const errorMsg = document.getElementById('error-message');
        errorMsg.style.display = 'block';

        MazeRenderer.addCharacterClass('error');

        setTimeout(() => {
            errorMsg.style.display = 'none';
            MazeRenderer.removeCharacterClass('error');
        }, 2000);
    },

    showSuccessMessage() {
        const successMsg = document.getElementById('success-message');
        successMsg.style.display = 'block';

        MazeRenderer.addCharacterClass('success');

        document.getElementById('btn-new-maze').style.display = 'block';

        setTimeout(() => {
            successMsg.style.display = 'none';
            MazeRenderer.removeCharacterClass('success');
        }, 3000);
    },

    resetCharacterPosition() {
        this.character = {
            x: this.maze.start.x,
            y: this.maze.start.y
        };

        MazeRenderer.placeCharacter(
            this.character.x,
            this.character.y,
            0
        );

        this.enableControls();
    },

    clearAll() {
        this.resetCharacterPosition();
        InstructionManager.clear();
    },

    disableControls() {
        document.getElementById('btn-up').disabled = true;
        document.getElementById('btn-down').disabled = true;
        document.getElementById('btn-left').disabled = true;
        document.getElementById('btn-right').disabled = true;
        document.getElementById('btn-clear').disabled = true;
        document.getElementById('btn-go').disabled = true;
        document.getElementById('btn-back').disabled = true;
    },

    enableControls() {
        document.getElementById('btn-up').disabled = false;
        document.getElementById('btn-down').disabled = false;
        document.getElementById('btn-left').disabled = false;
        document.getElementById('btn-right').disabled = false;
        document.getElementById('btn-clear').disabled = false;
        document.getElementById('btn-go').disabled = false;
        document.getElementById('btn-back').disabled = false;
    },

    hideDifficultySelector() {
        document.getElementById('difficulty-selector').style.display = 'none';
    },

    showDifficultySelector() {
        document.getElementById('difficulty-selector').style.display = 'flex';
        document.getElementById('maze-container').style.display = 'none';
        document.getElementById('btn-new-maze').style.display = 'none';
        MazeRenderer.clear();
        InstructionManager.clear();
        this.enableControls();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
