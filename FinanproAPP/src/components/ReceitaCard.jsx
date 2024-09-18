import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import CardBase from './CardItem'; // Importa o componente base genérico 'CardItem', que será reutilizado
import styles from '../styles/styles'; // Importa os estilos globais, incluindo os estilos específicos para receita

// Componente funcional ReceitaCard
const ReceitaCard = (props) => {
  console.log(props); // Verifica as props recebidas
  return (
    <CardBase
      {...props}
      cardStyle={styles.receitaCard}
      valueStyle={styles.receitaValue}
    />
  );
};


export default ReceitaCard; // Exporta o componente para ser usado em outros lugares
