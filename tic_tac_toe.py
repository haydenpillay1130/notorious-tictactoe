import tkinter as tk
from tkinter import messagebox
import random

# Initialize the main window
root = tk.Tk()
root.title("Tic Tac Toe")

# Initialize the board as a 3x3 grid of buttons
board = [[" " for _ in range(3)] for _ in range(3)]
buttons = [[None for _ in range(3)] for _ in range(3)]

# This function checks if there is a winner
def check_winner(board, player):
    # Check rows, columns, and diagonals for a win
    for row in board:
        if row.count(player) == 3:
            return True
    for col in range(3):
        if board[0][col] == player and board[1][col] == player and board[2][col] == player:
            return True
    if board[0][0] == player and board[1][1] == player and board[2][2] == player:
        return True
    if board[0][2] == player and board[1][1] == player and board[2][0] == player:
        return True
    return False

# This function checks if the board is full (i.e., a tie)
def check_tie(board):
    for row in board:
        if " " in row:
            return False
    return True

# This function handles a player's move
def player_move(row, col):
    if board[row][col] == " ":
        board[row][col] = "X"
        buttons[row][col].config(text="X", state=tk.DISABLED)
        
        if check_winner(board, "X"):
            messagebox.showinfo("Tic Tac Toe", "Congratulations! You win!")
            reset_board()
        elif check_tie(board):
            messagebox.showinfo("Tic Tac Toe", "It's a tie!")
            reset_board()
        else:
            system_move()

# This function handles the system's move
def system_move():
    move = find_block_move(board, "O")
    if move:
        board[move[0]][move[1]] = "O"
        buttons[move[0]][move[1]].config(text="O", state=tk.DISABLED)
    else:
        move = find_block_move(board, "X")
        if move:
            board[move[0]][move[1]] = "O"
            buttons[move[0]][move[1]].config(text="O", state=tk.DISABLED)
        else:
            while True:
                move = random.randint(0, 8)
                row, col = divmod(move, 3)
                if board[row][col] == " ":
                    board[row][col] = "O"
                    buttons[row][col].config(text="O", state=tk.DISABLED)
                    break

    if check_winner(board, "O"):
        messagebox.showinfo("Tic Tac Toe", "Sorry, the system wins!")
        reset_board()
    elif check_tie(board):
        messagebox.showinfo("Tic Tac Toe", "It's a tie!")
        reset_board()

# This function finds a move to block the player from winning
def find_block_move(board, player):
    for row in range(3):
        if board[row].count(player) == 2 and board[row].count(" ") == 1:
            return row, board[row].index(" ")

    for col in range(3):
        if [board[row][col] for row in range(3)].count(player) == 2 and [board[row][col] for row in range(3)].count(" ") == 1:
            return [board[row][col] for row in range(3)].index(" "), col

    if [board[i][i] for i in range(3)].count(player) == 2 and [board[i][i] for i in range(3)].count(" ") == 1:
        return [board[i][i] for i in range(3)].index(" "), [board[i][i] for i in range(3)].index(" ")

    if [board[i][2 - i] for i in range(3)].count(player) == 2 and [board[i][2 - i] for i in range(3)].count(" ") == 1:
        return [board[i][2 - i] for i in range(3)].index(" "), 2 - [board[i][2 - i] for i in range(3)].index(" ")

    return None

# This function resets the board
def reset_board():
    global board
    board = [[" " for _ in range(3)] for _ in range(3)]
    for row in range(3):
        for col in range(3):
            buttons[row][col].config(text=" ", state=tk.NORMAL)

# Create the buttons and assign them to the grid
for row in range(3):
    for col in range(3):
        button = tk.Button(root, text=" ", font=('normal', 40), width=5, height=2, 
                           command=lambda r=row, c=col: player_move(r, c))
        button.grid(row=row, column=col)
        buttons[row][col] = button

# Start the main loop
root.mainloop()
