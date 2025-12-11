# Path Memory Game

## Overview

This is a memory game where the user has to remember and click on a randomly generated path on a grid. The game supports both traditional square grids and more challenging hexagonal grids.

## Implemented Features

*   **Grid and Path:**
    *   Adjustable grid size (width and height).
    *   Adjustable path length.
    *   Random path generation.
*   **Gameplay:**
    *   Step-by-step visual presentation of the path to the user.
    *   User interaction to click the path in the correct order.
    *   Visual feedback for correct and incorrect clicks.
*   **Controls:**
    *   A "Start Game" button to begin the game.
    *   A "Reset Game" button to start a new game.
    *   Clear and accessible labels for all input controls.
*   **UI/UX:**
    *   A "Game Over" dialog that displays the final score and win/loss status.
    *   A "Play Again" button in the dialog to quickly restart.

## Current Plan

1.  **Implement a Hexagonal Grid Option:**
    *   Add a UI control (dropdown menu) to allow users to select the grid shape (square or hexagon).
    *   Update the path generation logic to correctly identify neighbors on a hexagonal grid (6 neighbors instead of 4).
    *   Implement new CSS styles to render the grid cells as hexagons and arrange them in a staggered layout.
