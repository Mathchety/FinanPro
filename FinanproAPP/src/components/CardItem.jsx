import React from 'react'; // Importa a biblioteca React para criar componentes funcionais
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Importa os componentes básicos do React Native
import { AntDesign } from '@expo/vector-icons'; // Importa ícones da biblioteca AntDesign

// Componente funcional SimpleCard
const SimpleCard = ({ title, value, type, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text> {/* Exibe o título do cartão */}
        <Text style={styles.value}>{value}</Text> {/* Exibe o valor do cartão */}
        <Text style={styles.type}>{type}</Text> {/* Exibe o tipo do cartão */}
      </View>
      <View style={styles.actions}>
        {/* Botão de editar */}
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <AntDesign name="edit" size={24} color="#4caf50" /> {/* Ícone de edição */}
        </TouchableOpacity>
        {/* Botão de excluir */}
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <AntDesign name="delete" size={24} color="#f44336" /> {/* Ícone de exclusão */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos específicos para o SimpleCard
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Layout horizontal para o cartão
    alignItems: 'center', // Alinha o conteúdo verticalmente ao centro
    backgroundColor: '#ffffff', // Cor de fundo do cartão
    padding: 15, // Espaçamento interno
    marginBottom: 10, // Margem inferior entre cartões
    borderRadius: 8, // Bordas arredondadas
    borderColor: '#e0e0e0', // Cor da borda
    borderWidth: 1, // Largura da borda
    shadowColor: '#000000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Offset da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 3, // Raio da sombra
    elevation: 2, // Elevação para sombras em dispositivos Android
  },
  content: {
    flex: 1, // Flexível para ocupar o espaço disponível
    justifyContent: 'center', // Alinha o conteúdo verticalmente ao centro
  },
  title: {
    fontSize: 16, // Tamanho da fonte do título
    fontWeight: 'bold', // Peso da fonte do título
    color: '#333333', // Cor do título
  },
  value: {
    fontSize: 14, // Tamanho da fonte do valor
    fontWeight: '600', // Peso da fonte do valor
    color: '#00796b', // Cor do valor
    marginTop: 5, // Margem superior
  },
  type: {
    fontSize: 12, // Tamanho da fonte do tipo
    color: '#888888', // Cor do tipo
    marginTop: 5, // Margem superior
  },
  actions: {
    flexDirection: 'row', // Layout horizontal para os botões de ação
    alignItems: 'center', // Alinha os botões de ação verticalmente ao centro
  },
  actionButton: {
    padding: 8, // Espaçamento interno dos botões de ação
    marginLeft: 10, // Margem esquerda entre os botões de ação
  },
});

export default SimpleCard; // Exporta o componente para ser usado em outros lugares
