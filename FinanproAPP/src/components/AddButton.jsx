import * as React from 'react'; // Importa a biblioteca React
import { View, StyleSheet } from 'react-native'; // Importa componentes e utilitários do React Native
import { FAB } from 'react-native-paper'; // Importa o componente Floating Action Button da biblioteca react-native-paper
import styles from '../styles/styles'; // Importa estilos personalizados

// Componente funcional AddButton
const AddButton = () => (
  <View style={styles.container}> {/* Contêiner para o botão flutuante */}
    <FAB
      icon="plus" // Ícone de "+" para adicionar
      style={styles.fab} // Estilos aplicados ao FAB
      onPress={() => console.log('Adicionar dados')} // Função chamada ao pressionar o botão
    />
  </View>
);

// Estilos locais para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // O contêiner ocupa todo o espaço disponível
  },
  fab: {
    position: 'absolute', // Posiciona o FAB de forma absoluta
    bottom: 16, // Distância do fundo da tela
    right: 16, // Distância da borda direita da tela
    backgroundColor: '#f59330', // Cor de fundo laranja
  },
});

export default AddButton; // Exporta o componente para uso em outras partes do aplicativo
