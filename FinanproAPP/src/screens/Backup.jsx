import React from 'react';
import { View, Button, Alert, Platform } from 'react-native'; // Importa componentes para exibir a tela e botões
import * as FileSystem from 'expo-file-system'; // Biblioteca para manipular arquivos no sistema de arquivos
import * as Sharing from 'expo-sharing'; // Biblioteca para compartilhar arquivos
import * as XLSX from 'xlsx'; // Biblioteca para criar e manipular arquivos Excel
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento assíncrono para persistir dados no dispositivo

const saveAndShareData = async () => {
  try {
    // Carregar dados do AsyncStorage (recupera todas as chaves e valores armazenados)
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys); // Obtém todos os pares chave/valor
    const data = result.map(([key, value]) => ({ key, value })); // Mapeia os dados para um array de objetos { key, value }

    console.log("Dados do AsyncStorage:", data); // Log para depuração, exibe os dados recuperados

    // Criar planilha Excel a partir dos dados recuperados
    const ws = XLSX.utils.json_to_sheet(data); // Converte os dados JSON em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de planilhas
    XLSX.utils.book_append_sheet(wb, ws, "AsyncStorageData"); // Adiciona a planilha criada ao livro

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' }); // Converte o livro de planilhas para base64
    const fileName = 'Dados.xlsx'; // Nome do arquivo Excel a ser criado
    const fileUri = `${FileSystem.documentDirectory}${fileName}`; // Caminho completo onde o arquivo será salvo

    // Salvar arquivo no sistema de arquivos local
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64, // Codificação em base64
    });

    // Compartilhar o arquivo se estiver em Android ou iOS
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        await Sharing.shareAsync(fileUri); // Usa o módulo de compartilhamento para compartilhar o arquivo
        Alert.alert("Sucesso", `Dados salvos e compartilhados: ${fileUri}`); // Exibe alerta de sucesso
      } catch (error) {
        console.error("Erro ao compartilhar o arquivo:", error); // Log de erro caso o compartilhamento falhe
        Alert.alert("Erro", "Não foi possível compartilhar o arquivo."); // Alerta ao usuário em caso de falha
      }
    }
  } catch (error) {
    console.error("Erro ao salvar e compartilhar dados:", error); // Log de erro caso algo falhe ao salvar ou compartilhar
    Alert.alert("Erro", "Não foi possível salvar e compartilhar os dados."); // Alerta ao usuário sobre a falha
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.clear(); // Limpa todos os dados do AsyncStorage
    Alert.alert("Sucesso", "Todos os dados foram excluídos."); // Alerta de sucesso ao usuário
  } catch (error) {
    console.error("Erro ao excluir dados:", error); // Log de erro caso a exclusão falhe
    Alert.alert("Erro", "Não foi possível excluir os dados."); // Alerta ao usuário sobre a falha
  }
};

const confirmClearAllData = () => {
  // Exibe um alerta de confirmação antes de excluir os dados
  Alert.alert(
    "Confirmação", // Título do alerta
    "Você tem certeza que deseja excluir todos os dados?", // Mensagem do alerta
    [
      {
        text: "Cancelar", // Botão de cancelar
        style: "cancel"
      },
      {
        text: "Excluir", // Botão de exclusão
        onPress: clearAllData, // Executa a função de exclusão ao pressionar
        style: "destructive" // Estilo destrutivo para enfatizar o impacto da ação
      }
    ]
  );
};

const BackupScreen = () => {
  return (
    // Tela principal com dois botões: um para salvar/compartilhar dados e outro para excluir todos os dados
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Backup e Compartilhar Dados" onPress={saveAndShareData} /> {/* Botão de backup e compartilhamento */}
      <Button title="Excluir Dados" onPress={confirmClearAllData} color="red" /> {/* Botão para excluir todos os dados */}
    </View>
  );
};

export default BackupScreen;
