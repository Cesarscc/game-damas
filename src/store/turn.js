import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

let API_URL = "";
// Verifica si estamos en el navegador antes de acceder a window
if (typeof window !== "undefined") {
  // Detectar si estamos en producción o local y establecer la URL de la API en consecuencia
  if (window.location.hostname === "cesarscc-recipes-peruvians.netlify.app") {
    API_URL = "https://cesarscc-recipes-peruvians.netlify.app/";
  } else {
    API_URL = "http://localhost:3000/";
  }
}

export const useTurnStore = create()(
  devtools(
    persist(
      (set, get) => {
        return {
          turn: 1, // Estado para el turno inicial
          savedTurn: (jugador) => {
            set({ turn: jugador });
          },
          reset: () => {
            set(
              {
                turn: 1,
                board: [
                  [1, 0, 1, 0, 1, 0, 1, 0],
                  [0, 1, 0, 1, 0, 1, 0, 1],
                  [1, 0, 1, 0, 1, 0, 1, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 2, 0, 2, 0, 2, 0, 2],
                  [2, 0, 2, 0, 2, 0, 2, 0],
                  [0, 2, 0, 2, 0, 2, 0, 2],
                ],
                positions: [{ i: -1, j: -1 }],
              },
              false,
              "RESET_GAME"
            );
          },
          board: [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
          ],
          savedBoard: (board) => {
            set({ board: board });
          },
          posActual: { i: 0, j: 0 },
          positions: [{ i: -1, j: -1 }],
          setPositions: (data) => {
            set({ positions: data });
          },
          setPosActual: (i, j) => {
            set({ posActual: { i: i, j: j } });
          },
        };
      },
      {
        name: "turn",
      }
    )
  )
);
