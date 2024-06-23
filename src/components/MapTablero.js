"use client";

import Tablero from "@/components/Tablero";
import { useTurnStore } from "@/store/turn";

const MapTablero = () => {
  const turn = useTurnStore((state) => state.turn);
  const reset = useTurnStore((state) => state.reset);

  return (
    <section className="flex flex-col justify-center items-center h-full w-full">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-5xl text-white font-semibold mb-5">
        Turno: Jugador de Fichas {turn == 1 ? "Blancas" : "Negras"}
      </h1>
      <Tablero turn={turn} />
      <div className="mt-2">
        <button
          className="bg-stone-800 font-semibold text-white text-xl h-10 w-36 rounded-2xl border-2 border-black transition-all hover:bg-slate-950 hover:delay-100"
          type="button"
          onClick={() => reset()}
        >
          Reiniciar
        </button>
      </div>
    </section>
  );
};

export default MapTablero;
