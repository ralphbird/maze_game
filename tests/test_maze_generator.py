"""Tests for the maze generation module."""

import pytest

from maze_game.maze_generator import _is_solvable, generate_maze


class TestMazeGenerator:
    """Tests for maze generation functionality."""

    @pytest.mark.parametrize("size", [5, 7, 10, 15])
    def test_generate_maze_correct_size(self, size):
        """Test that generated maze has correct dimensions."""
        maze_data = generate_maze(size)

        assert maze_data["size"] == size
        assert len(maze_data["grid"]) == size
        assert all(len(row) == size for row in maze_data["grid"])

    def test_generate_maze_has_required_keys(self):
        """Test that maze data contains all required keys."""
        maze_data = generate_maze(5)

        assert "size" in maze_data
        assert "grid" in maze_data
        assert "start" in maze_data
        assert "goal" in maze_data

    def test_start_position_is_origin(self):
        """Test that start position is at (0, 0)."""
        maze_data = generate_maze(5)

        assert maze_data["start"]["x"] == 0
        assert maze_data["start"]["y"] == 0

    def test_start_is_path_not_wall(self):
        """Test that start position is a path, not a wall."""
        maze_data = generate_maze(5)

        start_x = maze_data["start"]["x"]
        start_y = maze_data["start"]["y"]
        assert maze_data["grid"][start_y][start_x] == 0

    def test_goal_is_path_not_wall(self):
        """Test that goal position is a path, not a wall."""
        maze_data = generate_maze(5)

        goal_x = maze_data["goal"]["x"]
        goal_y = maze_data["goal"]["y"]
        assert maze_data["grid"][goal_y][goal_x] == 0

    def test_goal_position_in_bounds(self):
        """Test that goal position is within maze bounds."""
        maze_data = generate_maze(5)
        size = maze_data["size"]

        assert 0 <= maze_data["goal"]["x"] < size
        assert 0 <= maze_data["goal"]["y"] < size

    def test_maze_contains_paths(self):
        """Test that maze contains at least some paths."""
        maze_data = generate_maze(7)
        grid = maze_data["grid"]

        flat_grid = [cell for row in grid for cell in row]
        path_count = sum(1 for cell in flat_grid if cell == 0)
        assert path_count > 0

    def test_maze_is_solvable(self):
        """Test that generated maze has a path from start to goal."""
        maze_data = generate_maze(10)

        assert _is_solvable(maze_data["grid"], maze_data["start"], maze_data["goal"])

    def test_multiple_mazes_are_different(self):
        """Test that generating multiple mazes produces different results."""
        maze1 = generate_maze(7)
        maze2 = generate_maze(7)

        assert maze1["grid"] != maze2["grid"] or maze1["goal"] != maze2["goal"]

    def test_larger_maze_has_more_paths(self):
        """Test that larger mazes have more path cells."""
        small_maze = generate_maze(5)
        large_maze = generate_maze(10)

        small_paths = sum(cell == 0 for row in small_maze["grid"] for cell in row)
        large_paths = sum(cell == 0 for row in large_maze["grid"] for cell in row)

        assert large_paths > small_paths


class TestIsSolvable:
    """Tests for the maze solvability checker."""

    def test_simple_solvable_maze(self):
        """Test that a simple straight path is detected as solvable."""
        maze = [
            [0, 0, 0],
            [1, 1, 0],
            [1, 1, 0],
        ]
        start = {"x": 0, "y": 0}
        goal = {"x": 2, "y": 2}

        assert _is_solvable(maze, start, goal)

    def test_unsolvable_maze(self):
        """Test that a maze with no path is detected as unsolvable."""
        maze = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ]
        start = {"x": 0, "y": 0}
        goal = {"x": 2, "y": 2}

        assert not _is_solvable(maze, start, goal)

    def test_start_equals_goal(self):
        """Test that maze is solvable when start equals goal."""
        maze = [[0, 1], [1, 1]]
        start = {"x": 0, "y": 0}
        goal = {"x": 0, "y": 0}

        assert _is_solvable(maze, start, goal)

    def test_complex_path(self):
        """Test solvability with a complex winding path."""
        maze = [
            [0, 0, 1, 0, 0],
            [1, 0, 1, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ]
        start = {"x": 0, "y": 0}
        goal = {"x": 4, "y": 4}

        assert _is_solvable(maze, start, goal)
