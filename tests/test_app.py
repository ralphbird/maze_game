"""Tests for the Flask application."""

import pytest

from maze_game.app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


class TestRoutes:
    """Tests for Flask routes."""

    def test_index_route_returns_200(self, client):
        """Test that the index route returns successfully."""
        response = client.get("/")
        assert response.status_code == 200

    def test_index_route_returns_html(self, client):
        """Test that the index route returns HTML content."""
        response = client.get("/")
        assert response.content_type == "text/html; charset=utf-8"

    def test_api_maze_requires_post(self, client):
        """Test that the maze API only accepts POST requests."""
        response = client.get("/api/maze")
        assert response.status_code == 405

    def test_api_maze_returns_json(self, client):
        """Test that the maze API returns JSON."""
        response = client.post("/api/maze", json={"difficulty": 1})
        assert response.status_code == 200
        assert response.content_type == "application/json"

    def test_api_maze_has_required_fields(self, client):
        """Test that maze API response contains all required fields."""
        response = client.post("/api/maze", json={"difficulty": 1})
        data = response.get_json()

        assert "size" in data
        assert "grid" in data
        assert "start" in data
        assert "goal" in data
        assert "obstacles" in data

    @pytest.mark.parametrize("difficulty,expected_size", [(1, 4), (2, 5), (3, 6), (4, 7)])
    def test_api_maze_difficulty_mapping(self, client, difficulty, expected_size):
        """Test that difficulty levels map to correct maze sizes."""
        response = client.post("/api/maze", json={"difficulty": difficulty})
        data = response.get_json()

        assert data["size"] == expected_size

    def test_api_maze_default_difficulty(self, client):
        """Test that maze API uses default difficulty when not specified."""
        response = client.post("/api/maze", json={})
        data = response.get_json()

        assert data["size"] == 4

    def test_api_maze_invalid_difficulty_uses_default(self, client):
        """Test that invalid difficulty falls back to default."""
        response = client.post("/api/maze", json={"difficulty": 999})
        data = response.get_json()

        assert data["size"] == 4

    def test_api_maze_start_position(self, client):
        """Test that maze has correct start position."""
        response = client.post("/api/maze", json={"difficulty": 1})
        data = response.get_json()
        size = data["size"]

        assert data["start"]["x"] == size - 1
        assert data["start"]["y"] == size - 1

    def test_api_maze_goal_in_bounds(self, client):
        """Test that goal position is within maze bounds."""
        response = client.post("/api/maze", json={"difficulty": 2})
        data = response.get_json()
        size = data["size"]

        assert 0 <= data["goal"]["x"] < size
        assert 0 <= data["goal"]["y"] < size

    def test_api_maze_has_obstacles(self, client):
        """Test that maze includes obstacles."""
        response = client.post("/api/maze", json={"difficulty": 2})
        data = response.get_json()

        assert isinstance(data["obstacles"], list)
        assert len(data["obstacles"]) > 0

    def test_api_maze_obstacles_have_type(self, client):
        """Test that obstacles have a type field."""
        response = client.post("/api/maze", json={"difficulty": 2})
        data = response.get_json()

        for obstacle in data["obstacles"]:
            assert "x" in obstacle
            assert "y" in obstacle
            assert "type" in obstacle
