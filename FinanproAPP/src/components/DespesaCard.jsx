import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import CardBase from './CardItem'; // Importa o componente base genérico 'CardItem', que será reutilizado
import styles from '../styles/styles'; // Importa os estilos globais, incluindo os estilos específicos para despesa

// Componente funcional DespesaCard
const DespesaCard = (props) => {
  return (
    // O componente 'CardBase' é reutilizado para criar um cartão de despesa específico
    // As props passadas para 'DespesaCard' são propagadas para 'CardBase' com o spread operator ({...props})
    <CardBase
      {...props}
      cardStyle={styles.despesaCard} // Aplica o estilo específico do cartão de despesa
      valueStyle={styles.despesaValue} // Aplica o estilo específico para o valor da despesa
    />
  );
};

export default DespesaCard; // Exporta o componente para ser usado em outros lugares
