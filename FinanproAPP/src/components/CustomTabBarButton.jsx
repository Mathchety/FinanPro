import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import { View, StyleSheet, Text} from 'react-native'; // Importa os componentes básicos do React Native
import AddOpcao from '../screens/AddOpcao'; // Importa o componente de tela 'AddOpcao' para ser usado como botão flutuante

// Componente funcional CustomTabBarButton
const CustomTabBarButton = () => {
  return (
    <View style={styles.container}>
      {/* Botão Flutuante Centralizado */}
      <AddOpcao /> {/* Renderiza o componente 'AddOpcao' como o botão flutuante */}
    </View>
  );
};

// Estilos específicos para o botão personalizado
const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que o View ocupe todo o espaço disponível
    justifyContent: 'center', // Centraliza verticalmente o conteúdo
    alignItems: 'center', // Centraliza horizontalmente o conteúdo
    position: 'absolute', // Posiciona o View de forma absoluta
    bottom: 16, // Define a distância do fundo da tela
    left: 0, // Define a distância da borda esquerda
    right: 0, // Define a distância da borda direita
  },
});

export default CustomTabBarButton; // Exporta o componente para ser usado em outros lugares
