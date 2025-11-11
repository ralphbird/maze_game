# Underwater Maze Game

An interactive game that teaches programming concepts to young children (ages 6+) through visual problem-solving. Kids help a diver navigate through underwater mazes to find treasure by creating sequences of movement commands.

**🎮 [Play Now](https://maze-game-zdvb.onrender.com)**

## About This Game

This game introduces children to basic programming concepts without requiring any reading or typing skills. Instead of writing code, kids use simple arrow buttons to create a sequence of instructions that the diver will follow.

### What Kids Learn

- **Sequencing**: Commands are executed in order, one at a time
- **Planning ahead**: Think through the path before executing
- **Problem solving**: Try different approaches until you find a solution
- **Debugging**: When something doesn't work, figure out what went wrong and try again

### How to Play

1. **Choose a difficulty level** by clicking the star buttons (more stars = bigger maze)
2. **Create your instruction sequence** by clicking the arrow buttons:
   - ↑ Move forward one space
   - ↶ Turn left
   - ↷ Turn right
3. **Rearrange instructions** by dragging them into a different order
4. **Delete instructions** by hovering over them and clicking the × button
5. **Click "Go!"** to watch the diver follow your instructions
6. **Reach the treasure** to win!

If the diver hits a wall, the game will reset and you can try again with a different sequence.

## For Developers

Want to run this locally or contribute to the project?

### Requirements

- Python 3.13+
- uv (Python package manager)
- asdf (version manager)

### Quick Start

```bash
# Install dependencies
asdf install
uv sync --all-extras

# Run the game
cd src && uv run python -m maze_game.app
```

The game will be available at <http://localhost:5001>

### Project Structure

- `src/maze_game/` - Flask backend and maze generation
- `static/` - Frontend CSS and JavaScript
- `tests/` - Test suite

### Tech Stack

- Backend: Flask (Python)
- Frontend: Vanilla JavaScript
- Maze Generation: Depth-first search algorithm
- Deployment: Render.com
