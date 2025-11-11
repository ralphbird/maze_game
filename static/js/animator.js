const Animator = {
    isAnimating: false,
    animationDelay: 800,

    async executeInstructions(instructions, character, maze, onComplete) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        let currentX = character.x;
        let currentY = character.y;

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            let nextX = currentX;
            let nextY = currentY;

            if (instruction.type === INSTRUCTION_TYPES.UP) {
                nextY = currentY - 1;
            } else if (instruction.type === INSTRUCTION_TYPES.DOWN) {
                nextY = currentY + 1;
            } else if (instruction.type === INSTRUCTION_TYPES.LEFT) {
                nextX = currentX - 1;
            } else if (instruction.type === INSTRUCTION_TYPES.RIGHT) {
                nextX = currentX + 1;
            }

            const validMove = this.isValidMove(nextX, nextY, maze);
            if (validMove === true) {
                currentX = nextX;
                currentY = nextY;
                MazeRenderer.updateCharacter(currentX, currentY, 0);
                await this.wait(this.animationDelay);
            } else {
                this.isAnimating = false;
                onComplete({
                    success: false,
                    type: validMove === 'obstacle' ? 'obstacle' : 'wall',
                    x: currentX,
                    y: currentY
                });
                return;
            }
        }

        this.isAnimating = false;

        const reachedGoal = (currentX === maze.goal.x && currentY === maze.goal.y);
        onComplete({
            success: reachedGoal,
            type: reachedGoal ? 'goal' : 'incomplete',
            x: currentX,
            y: currentY
        });
    },

    isValidMove(x, y, maze) {
        if (x < 0 || x >= maze.size || y < 0 || y >= maze.size) {
            return false;
        }

        if (maze.grid[y][x] !== 0) {
            return false;
        }

        const hasObstacle = maze.obstacles?.some(obs => obs.x === x && obs.y === y);
        if (hasObstacle) {
            return 'obstacle';
        }

        return true;
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    cancel() {
        this.isAnimating = false;
    }
};
