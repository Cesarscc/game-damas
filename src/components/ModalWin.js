const ModalWin = ({ closeModalAlert, winPiece }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-gray-600 w-[90%] sm:w-[85%] lg:w-1/2 mx-5 h-[40%] p-4 rounded-3xl">
        <div className="flex flex-col justify-center items-center gap-5 mt-14 md:mt-16 lg:mt-10">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins text-center font-bold text-white">
            GANÓ EL JUGADOR DE FICHAS {winPiece}
          </p>
        </div>
        <div className="flex items-center justify-center mt-10">
          <button
            className="bg-black transition-all hover:bg-gray-900 text-white font-poppins text-xl w-24 h-10 rounded-md font-semibold"
            onClick={closeModalAlert}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWin;
