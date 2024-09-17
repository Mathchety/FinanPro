import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import CardBase from './CardItem'; // Importa o componente base genérico 'CardItem', que será reutilizado
import styles from '../styles/styles'; // Importa os estilos globais, incluindo os estilos específicos para receita

// Componente funcional ReceitaCard
const ReceitaCard = (props) => {
  return (
    // O componente 'CardBase' é reutilizado para criar um cartão de receita específico
    // As props passadas para 'ReceitaCard' são propagadas para 'CardBase' com o spread operator ({...props})
    <CardBase
      {...props}
      cardStyle={styles.receitaCard} // Aplica o estilo específico do cartão de receita
      valueStyle={styles.receitaValue} // Aplica o estilo específico para o valor da receita
    />
  );
};

export default ReceitaCard; // Exporta o componente para ser usado em outros lugares
