import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Ícone para o botão flutuante
import { useNavigation } from "@react-navigation/native"; // Hook para navegação entre telas

const AddOpcao = () => {
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const navigation = useNavigation(); // Hook que permite a navegação entre telas

  // Função para navegar para a tela de "Calcular Juros Compostos" e fechar o modal
  const navigateToCalcularJurosCompostos = () => {
    setModalVisible(false); // Fecha o modal
    navigation.navigate("CalcularJurosCompostos"); // Navega para a tela correspondente
  };

  // Função para navegar para a tela de "Calcular Juros Simples" e fechar o modal
  const navigateToCalcularJurosSimples = () => {
    setModalVisible(false); // Fecha o modal
    navigation.navigate("CalcularJurosSimples"); // Navega para a tela correspondente
  };

  // Função para navegar para a tela de "Acompanhar Rendimento CDI" e fechar o modal
  const navigateToAcompanharRendimentoCdi = () => {
    setModalVisible(false); // Fecha o modal
    navigation.navigate("AcompanharRendimentoCdi"); // Navega para a tela correspondente
  };

  return (
    <View style={styles.container}>
      {/* Botão Flutuante Central */}
      {/* Este botão flutuante abre o modal quando clicado */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <AntDesign name="calculator" size={24} color="white" /> {/* Ícone de calculadora */}
      </TouchableOpacity>

      {/* Modal com opções */}
      {/* Modal que aparece ao clicar no botão flutuante, com opções para navegação */}
      <Modal
        animationType="slide" // Define a animação do modal
        transparent={true} // O modal será transparente com fundo visível
        visible={modalVisible} // Controla a visibilidade do modal
        onRequestClose={() => setModalVisible(false)} // Fecha o modal ao solicitar fechamento
      >
        {/* Área clicável para fechar o modal ao clicar fora do menu */}
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1} // Define a opacidade quando o modal for clicado
          onPressOut={() => setModalVisible(false)} // Fecha o modal ao clicar fora
        >
          {/* Menu de opções dentro do modal */}
          <View style={styles.menu}>
            {/* Botão para navegar para "Calculadora de Juros Composto" */}
            <TouchableOpacity onPress={navigateToCalcularJurosCompostos} style={styles.menuItem}>
              <Text style={styles.menuText}>Calculadora de Juros Composto</Text>
            </TouchableOpacity>

            {/* Botão para navegar para "Calculadora de Juros Simples" */}
            <TouchableOpacity onPress={navigateToCalcularJurosSimples} style={styles.menuItem}>
              <Text style={styles.menuText}>Calculadora de Juros Simples</Text>
            </TouchableOpacity>

            {/* Botão para navegar para "Acompanhar Rendimento CDI" */}
            <TouchableOpacity onPress={navigateToAcompanharRendimentoCdi} style={styles.menuItem}>
              <Text style={styles.menuText}>Acompanhar Rendimento CDI</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute", // Posiciona o botão flutuante no final da tela
    bottom: 20,
    backgroundColor: "#7b147b", // Cor de fundo do botão
    borderRadius: 30, // Torna o botão redondo
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10, // Adiciona uma sombra para destacar o botão
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escurecido para o modal
  },
  menu: {
    backgroundColor: "#7b147b", // Cor de fundo do menu de opções
    borderRadius: 10, // Bordas arredondadas do menu
    padding: 30,
    width: 300,
    alignItems: "center", // Centraliza o conteúdo no menu
  },
  menuItem: {
    marginBottom: 10, // Espaçamento entre os itens do menu
  },
  menuText: {
    color: "white", // Cor do texto do menu
    fontSize: 20, // Tamanho da fonte do texto
  },
});

export default AddOpcao;
