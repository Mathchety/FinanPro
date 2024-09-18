import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import CardBase from './CardItem'; // Importa o componente base genérico 'CardItem', que será reutilizado
import styles from '../styles/styles'; // Importa os estilos globais, incluindo os estilos específicos para despesa

// Componente funcional DespesaCard
const DespesaCard = (props) => {
  console.log(props);  // Verifique os valores passados
  return (
    <CardBase
      {...props}
      cardStyle={styles.despesaCard}
      valueStyle={styles.despesaValue}
    />
  );
};

export default DespesaCard; // Exporta o componente para ser usado em outros lugares
