export default function Square({ value, onClick }) {
  return (
    <button 
      className="w-24 h-24 bg-yellow-100 border-2 border-yellow-300 rounded-md focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-3" 
      onClick={onClick}
    >
      {value === 'goku' && <img src="/goku.svg" alt="Goku's hair" className="h-16 w-16 mx-auto my-4 animate-pulse" />}
      {value === 'dragon-ball' && <img src="/dragon-ball.svg" alt="Dragon Ball" className="h-16 w-16 mx-auto my-4 animate-spin-slow" />}
    </button>
  );
}
