import { useTurnStore } from "@/store/turn";
import { useEffect, useState } from "react";
import ModalWin from "./ModalWin";

const Tablero = ({ turn }) => {
  const savedTurn = useTurnStore((state) => state.savedTurn);
  const savedBoard = useTurnStore((state) => state.savedBoard);
  const board = useTurnStore((state) => state.board);
  const positions = useTurnStore((state) => state.positions);
  const setPositions = useTurnStore((state) => state.setPositions);
  const posActual = useTurnStore((state) => state.posActual);
  const setPosActual = useTurnStore((state) => state.setPosActual);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winPiece, setWinPiece] = useState("");
  const reset = useTurnStore((state) => state.reset);

  useEffect(() => {
    checkWin();
  }, [board]);

  const checkWin = () => {
    let winBlack = true;
    let winWhite = true;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 1 || cell === 3) {
          winBlack = false;
        }
        if (cell === 2 || cell === 4) {
          winWhite = false;
        }
      });
    });

    if (winBlack) {
      setWinPiece("NEGRAS");
      openModalAlert();
    }

    if (winWhite) {
      setWinPiece("BLANCAS");
      openModalAlert();
    }
  };

  const checkMove = (i, j) => {
    const piece = board[i][j];
    let data = [];

    const addMove = (x, y, capture) => {
      if (capture) {
        data.push({ i: x, j: y, capture: true });
      } else {
        data.push({ i: x, j: y });
      }
    };

    const addCaptureMoves = (x, y, dx, dy) => {
      if (
        x + 2 * dx >= 0 &&
        x + 2 * dx < board.length &&
        y + 2 * dy >= 0 &&
        y + 2 * dy < board.length
      ) {
        if (board[x + dx][y + dy] !== 0 && board[x + dx][y + dy] !== piece) {
          if (board[x + 2 * dx][y + 2 * dy] === 0) {
            addMove(x + 2 * dx, y + 2 * dy, true);
            // Recursively check for additional captures
            addCaptureMoves(x + 2 * dx, y + 2 * dy, dx, dy);
          }
        }
      }
    };

    const addQueenMoves = (x, y) => {
      // Check all 4 possible directions for moves
      addDirection(x, y, 1, 1); // down-right
      addDirection(x, y, 1, -1); // down-left
      addDirection(x, y, -1, 1); // up-right
      addDirection(x, y, -1, -1); // up-left
    };

    const addDirection = (x, y, dx, dy) => {
      let nx = x + dx;
      let ny = y + dy;
      let canCapture = false;

      while (nx >= 0 && nx < board.length && ny >= 0 && ny < board.length) {
        if (board[nx][ny] === 0) {
          // Empty cell, can move there
          if (!canCapture) {
            addMove(nx, ny, false); // Non-capturing move
          }
        } else if (board[nx][ny] !== piece && board[nx][ny] % 2 !== piece % 2) {
          // Enemy piece found, check next cell
          if (
            nx + dx >= 0 &&
            nx + dx < board.length &&
            ny + dy >= 0 &&
            ny + dy < board.length
          ) {
            if (board[nx + dx][ny + dy] === 0) {
              addMove(nx + dx, ny + dy, true); // Capturing move
              // Recursively check for additional captures
              addDirection(nx + dx, ny + dy, dx, dy);
            }
          }
          canCapture = true;
        } else {
          // Own piece found or another piece of the same color, stop this direction
          break;
        }

        nx += dx;
        ny += dy;
      }
    };

    if (turn === 1) {
      if (piece === 1 || piece === 3) {
        // White piece or Queen
        if (piece === 3) {
          addQueenMoves(i, j);
        } else {
          if (
            i < board.length - 1 &&
            j < board.length - 1 &&
            board[i + 1][j + 1] === 0
          ) {
            addMove(i + 1, j + 1, false);
          }
          if (i < board.length - 1 && j > 0 && board[i + 1][j - 1] === 0) {
            addMove(i + 1, j - 1, false);
          }
          addCaptureMoves(i, j, 1, 1);
          addCaptureMoves(i, j, 1, -1);
        }
      }
    } else if (turn === 2) {
      if (piece === 2 || piece === 4) {
        // Black piece or Queen
        if (piece === 4) {
          addQueenMoves(i, j);
        } else {
          if (i > 0 && j < board.length - 1 && board[i - 1][j + 1] === 0) {
            addMove(i - 1, j + 1, false);
          }
          if (i > 0 && j > 0 && board[i - 1][j - 1] === 0) {
            addMove(i - 1, j - 1, false);
          }
          addCaptureMoves(i, j, -1, 1);
          addCaptureMoves(i, j, -1, -1);
        }
      }
    }

    setPositions(data);
    setSelectedPiece({ i, j });
  };

  const handleMove = (i, j) => {
    if (!selectedPiece) return;

    const { i: si, j: sj } = selectedPiece;
    const piece = board[si][sj];
    const dx = Math.sign(i - si);
    const dy = Math.sign(j - sj);

    board[si][sj] = 0;

    let captured = false;
    let x = si + dx;
    let y = sj + dy;

    while (x !== i || y !== j) {
      if (board[x][y] !== 0 && board[x][y] !== piece) {
        // Capture piece
        board[x][y] = 0;
        captured = true;
      }
      x += dx;
      y += dy;
    }

    board[i][j] = piece;

    if (piece === 1 && i === board.length - 1) {
      board[i][j] = 3; // Convert to Queen
    } else if (piece === 2 && i === 0) {
      board[i][j] = 4; // Convert to Queen
    }

    setPositions([]);
    setPosActual({ i, j });
    savedBoard([...board]);
    savedTurn(turn === 1 ? 2 : 1);
  };

  const openModalAlert = () => {
    setIsOpenAlert(true);
  };

  const closeModalAlert = () => {
    setIsOpenAlert(false);
    reset();
  };

  return (
    <>
      {board.length !== 0 ? (
        <div className="grid grid-cols-8 gap-1 border-8 border-[#3e3e3e] content-center">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`flex justify-center items-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 ${
                  (i + j) % 2 === 0 ? "bg-[#ffc649]" : "bg-[#b55c2f]"
                }`}
              >
                {cell === 1 ? (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white cursor-pointer"
                    onClick={() => checkMove(i, j)}
                  />
                ) : cell === 2 ? (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black cursor-pointer"
                    onClick={() => checkMove(i, j)}
                  />
                ) : cell === 3 ? (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white cursor-pointer flex justify-center items-center font-mono font-semibold"
                    onClick={() => checkMove(i, j)}
                  >
                    RB
                  </div>
                ) : cell === 4 ? (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black cursor-pointer flex justify-center items-center font-mono font-semibold text-white"
                    onClick={() => checkMove(i, j)}
                  >
                    RN
                  </div>
                ) : (
                  <div
                    className={`${
                      positions.some((pos) => pos.i === i && pos.j === j)
                        ? "border-4 border-green-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-300/50 cursor-pointer"
                        : ""
                    }`}
                    onClick={() => handleMove(i, j)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-52 w-full mt-20">
          <div className="loader"></div>
        </div>
      )}
      {isOpenAlert && (
        <ModalWin closeModalAlert={closeModalAlert} winPiece={winPiece} />
      )}
    </>
  );
};

export default Tablero;
