# Maze Game - Programming for Kids

A visual, interactive maze game designed to teach programming basics to 6-year-olds. Children create instruction sequences using intuitive icons (forward, turn left, turn right) to guide a character through a maze.

## Features

- **Icon-based interface** - No reading required
- **Drag-and-drop instruction builder** - Reorder and delete instructions with mouse
- **Visual feedback** - Animations for success and errors
- **Multiple difficulty levels** - 5x5, 7x7, 10x10, and 15x15 mazes
- **Procedurally generated mazes** - New maze every time
- **Kid-friendly design** - Large buttons, bright colors, smooth animations

## Requirements

- Python 3.12+
- uv (Python package manager)
- asdf (version manager)

## Installation

1. Install asdf and required plugins:

   ```bash
   asdf plugin add python
   asdf plugin add uv
   ```

2. Install the versions specified in `.tool-versions`:

   ```bash
   asdf install
   ```

3. Install project dependencies:

   ```bash
   uv sync --all-extras
   ```

## Running the Application

Start the Flask development server:

   ```bash
   uv run python -m maze_game.app
   ```

The game will be available at: <http://localhost:5001>

## How to Play

1. **Select difficulty** - Click on a star button (1-4 stars) to choose maze size
2. **Build instruction sequence** - Click arrow buttons to add instructions:
   - ↑ Forward - Move one step forward
   - ↶ Turn Left - Rotate 90° counterclockwise
   - ↷ Turn Right - Rotate 90° clockwise
3. **Reorder instructions** - Drag and drop to change order
4. **Delete instructions** - Hover over instruction and click × button
5. **Execute** - Click "Go!" to watch the character follow your instructions
6. **Try again** - If the character hits a wall, it resets automatically
7. **Success** - Reach the trophy 🏆 to win!

## Development

### Running Tests

```bash
uv run pytest tests/ -v
```

### Code Formatting

The project uses Ruff for linting and formatting:

```bash
uv run ruff check .
uv run ruff format .
```

## Project Structure

```text
maze_game/
├── src/maze_game/          # Python backend
│   ├── app.py             # Flask application
│   ├── maze_generator.py  # Maze generation logic
│   └── templates/         # HTML templates
├── static/                # Frontend assets
│   ├── css/              # Styles
│   └── js/               # Game logic
├── tests/                # Test suite
└── claude_plans/         # Architecture documentation
```

## Architecture

The game uses:

- **Backend**: Flask (Python) for serving the app and generating mazes
- **Frontend**: Vanilla JavaScript for game logic
- **Maze Generation**: Depth-first search algorithm with solvability verification
- **UI**: CSS Grid for maze rendering, SortableJS for drag-and-drop

See `claude_plans/architecture.md` for detailed technical documentation.

## Educational Goals

This game introduces fundamental programming concepts:

- **Sequencing** - Instructions execute in order
- **Commands** - Each instruction performs a specific action
- **Debugging** - Trial and error to find working solution
- **Planning** - Think ahead to solve the maze

Perfect for introducing 6-year-olds to computational thinking without requiring reading skills.
