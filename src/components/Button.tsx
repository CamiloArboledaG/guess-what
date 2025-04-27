import React from 'react';

interface ButtonProps {
  id: number; // Un identificador único para esta carta/botón
  number: number; // El número que oculta la carta
  isRevealed: boolean; // Estado para saber si la carta está revelada
  onClick: (id: number) => void; // Función que se llama al hacer clic
  error: boolean; // Estado para saber si la carta está en error
  success: boolean; // Estado para saber si la carta está en éxito
}

const Button: React.FC<ButtonProps> = ({ id, number, isRevealed, onClick, error, success }) => {
  
  // Manejador de clic: solo llama a la función onClick si la carta no está revelada
  const handleClick = () => {
    if (!isRevealed) {
      onClick(id);
    }
  };

  // Estilos básicos para que parezca una carta
  const buttonStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    margin: '5px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: isRevealed ? 'default' : 'pointer',
    backgroundColor: error ? 'red' : success ? 'green' : isRevealed ? 'white' : 'white', // Blanco si revelado, azul si no
    color: isRevealed ? 'black' : 'black', // Muestra el número o lo oculta con el color de fondo
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none', // Evita seleccionar el texto
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      // Deshabilitar el botón si ya está revelado podría ser útil
      // dependiendo de la lógica del juego principal
      // disabled={isRevealed} 
    >
      {isRevealed ? number : '?'} 
    </button>
  );
};

export default Button;
