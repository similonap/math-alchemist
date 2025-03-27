# Number Splitting Game - Component Structure

This document outlines the component structure of the Number Splitting Game application.

## Core Components

### Game Components
- `GameWithLevelSystem`: Main game component that orchestrates the game logic and UI
- `GameBoard`: Displays the game board with numbers and input fields
- `NumberDisplay`: Reusable component for displaying numbers in circles
- `NumberInput`: Input component for user answers
- `ScoreDisplay`: Shows the game scores (completed, mistakes, max sum)
- `FeedbackMessage`: Displays feedback messages to the user
- `CelebrationEffect`: Celebration animation when the user answers correctly

### Level System Components
- `LevelSidebar`: Sidebar showing level information
- `LevelBadge`: Badge showing the current level
- `XPBar`: Visual representation of XP progress

### Store Components
- `MagicStore`: Main store component
- `StoreItem`: Individual store item
- `FluidMixingLab`: Interface for mixing fluids

### Animation Components
- `XPAnimation`: Animations for XP gain/loss
- `CoinAnimation`: Animations for coin gain and streak bonuses
- `MagicalCat`: Animated cat that runs around the screen

### Dialog Components
- `Dialog`: Base dialog component
- `LabNameDialog`: Dialog for naming the lab
- `LevelUpDialog`: Dialog shown when leveling up

## State Management

The application uses Zustand for state management with the following main stores:
- `useGameStore`: Manages game state, level system, and store functionality

## Component Hierarchy

