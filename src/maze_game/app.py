"""Flask application for the maze game."""

from flask import Flask, jsonify, render_template, request

from maze_game.maze_generator import generate_maze

app = Flask(__name__, template_folder="templates", static_folder="../../static")


@app.route("/")
def index():
    """Serve the main game page."""
    return render_template("index.html")


@app.route("/api/maze", methods=["POST"])
def get_maze():
    """Generate a new maze.

    Expects JSON body with 'difficulty' parameter (1-4).
    Returns maze data including grid, start position, and goal position.
    """
    data = request.get_json()
    difficulty = data.get("difficulty", 1)

    size_map = {1: 4, 2: 5, 3: 6, 4: 7}
    size = size_map.get(difficulty, 4)

    maze_data = generate_maze(size)
    return jsonify(maze_data)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
