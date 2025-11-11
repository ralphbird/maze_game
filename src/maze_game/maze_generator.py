"""Maze generation logic using depth-first search algorithm."""

import random
from collections import deque


def generate_maze(size: int) -> dict:
    """Generate a solvable maze using depth-first search algorithm.

    Args:
        size: The dimensions of the maze (creates size x size grid)

    Returns:
        Dictionary containing:
            - size: int, the maze dimensions
            - grid: list[list[int]], 2D array where 0=path, 1=wall
            - start: dict with x, y coordinates
            - goal: dict with x, y coordinates
    """
    maze = _create_maze_dfs(size)

    start = {"x": size - 1, "y": size - 1}

    goal_candidates = [
        (x, y) for x in range(size) for y in range(size)
        if maze[y][x] == 0 and abs(x - start["x"]) + abs(y - start["y"]) >= 4
    ]

    if not goal_candidates:
        goal_candidates = [(x, y) for x in range(size) for y in range(size) if maze[y][x] == 0]

    goal_x, goal_y = random.choice(goal_candidates)
    goal = {"x": goal_x, "y": goal_y}

    if not _is_solvable(maze, start, goal):
        return generate_maze(size)

    obstacle_count_map = {4: 2, 5: 4, 6: 9, 7: 15}
    obstacle_count = obstacle_count_map.get(size, 0)
    obstacles = _place_obstacles(maze, start, goal, obstacle_count)

    if not _is_solvable_with_obstacles(maze, start, goal, obstacles):
        return generate_maze(size)

    return {"size": size, "grid": maze, "start": start, "goal": goal, "obstacles": obstacles}


def _create_maze_dfs(size: int) -> list[list[int]]:
    """Create maze using depth-first search with backtracking.

    Args:
        size: The dimensions of the maze

    Returns:
        2D array representing the maze (0=path, 1=wall)
    """
    maze = [[1 for _ in range(size)] for _ in range(size)]

    start_x, start_y = size - 1, size - 1
    maze[start_y][start_x] = 0

    stack = [(start_x, start_y)]
    visited = {(start_x, start_y)}

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while stack:
        current_x, current_y = stack[-1]
        random.shuffle(directions)

        found_neighbor = False
        for dx, dy in directions:
            next_x, next_y = current_x + dx, current_y + dy

            if (
                0 <= next_x < size
                and 0 <= next_y < size
                and (next_x, next_y) not in visited
            ):
                maze[next_y][next_x] = 0
                visited.add((next_x, next_y))
                stack.append((next_x, next_y))
                found_neighbor = True
                break

        if not found_neighbor:
            stack.pop()

    _add_additional_paths(maze, size)

    return maze


def _add_additional_paths(maze: list[list[int]], size: int) -> None:
    """Add some additional paths to make the maze less linear.

    Args:
        maze: The maze to modify (in-place)
        size: The dimensions of the maze
    """
    num_additional_paths = max(2, size // 3)

    for _ in range(num_additional_paths):
        x = random.randint(0, size - 1)
        y = random.randint(0, size - 1)

        if maze[y][x] == 1:
            adjacent_paths = 0
            if x > 0 and maze[y][x - 1] == 0:
                adjacent_paths += 1
            if x < size - 1 and maze[y][x + 1] == 0:
                adjacent_paths += 1
            if y > 0 and maze[y - 1][x] == 0:
                adjacent_paths += 1
            if y < size - 1 and maze[y + 1][x] == 0:
                adjacent_paths += 1

            if adjacent_paths >= 2:
                maze[y][x] = 0


def _place_obstacles(
    maze: list[list[int]], start: dict[str, int], goal: dict[str, int], count: int
) -> list[dict[str, int]]:
    """Place obstacles randomly in the maze.

    Args:
        maze: The maze grid
        start: Start position
        goal: Goal position
        count: Number of obstacles to place

    Returns:
        List of obstacle positions with type
    """
    size = len(maze)
    obstacles = []
    obstacle_types = ["🦈", "🪨", "🪸"]

    available_positions = [
        (x, y) for x in range(size) for y in range(size)
        if maze[y][x] == 0
        and (x, y) != (start["x"], start["y"])
        and (x, y) != (goal["x"], goal["y"])
    ]

    random.shuffle(available_positions)

    for i in range(min(count, len(available_positions))):
        x, y = available_positions[i]
        obstacle_type = random.choice(obstacle_types)
        obstacles.append({"x": x, "y": y, "type": obstacle_type})

    return obstacles


def _is_solvable_with_obstacles(
    maze: list[list[int]],
    start: dict[str, int],
    goal: dict[str, int],
    obstacles: list[dict[str, int]],
) -> bool:
    """Check if maze is solvable considering obstacles.

    Args:
        maze: The maze to check
        start: Start position
        goal: Goal position
        obstacles: List of obstacle positions

    Returns:
        True if a path exists avoiding obstacles, False otherwise
    """
    size = len(maze)
    queue = deque([(start["x"], start["y"])])
    visited = {(start["x"], start["y"])}
    obstacle_set = {(obs["x"], obs["y"]) for obs in obstacles}

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        x, y = queue.popleft()

        if x == goal["x"] and y == goal["y"]:
            return True

        for dx, dy in directions:
            next_x, next_y = x + dx, y + dy

            if (
                0 <= next_x < size
                and 0 <= next_y < size
                and maze[next_y][next_x] == 0
                and (next_x, next_y) not in visited
                and (next_x, next_y) not in obstacle_set
            ):
                visited.add((next_x, next_y))
                queue.append((next_x, next_y))

    return False


def _is_solvable(
    maze: list[list[int]], start: dict[str, int], goal: dict[str, int]
) -> bool:
    """Check if there's a path from start to goal using BFS.

    Args:
        maze: The maze to check
        start: Start position with x, y coordinates
        goal: Goal position with x, y coordinates

    Returns:
        True if a path exists, False otherwise
    """
    size = len(maze)
    queue = deque([(start["x"], start["y"])])
    visited = {(start["x"], start["y"])}

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        x, y = queue.popleft()

        if x == goal["x"] and y == goal["y"]:
            return True

        for dx, dy in directions:
            next_x, next_y = x + dx, y + dy

            if (
                0 <= next_x < size
                and 0 <= next_y < size
                and maze[next_y][next_x] == 0
                and (next_x, next_y) not in visited
            ):
                visited.add((next_x, next_y))
                queue.append((next_x, next_y))

    return False
