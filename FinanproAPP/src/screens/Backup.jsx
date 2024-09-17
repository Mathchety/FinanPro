import React from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveAndShareData = async () => {
  try {
    // Carregar dados do AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    const data = result.map(([key, value]) => ({ key, value }));

    console.log("Dados do AsyncStorage:", data); // Log para depuração

    // Criar planilha Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AsyncStorageData");

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileName = 'Dados.xlsx';
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Salvar arquivo no sistema de arquivos
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartilhar arquivo
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        await Sharing.shareAsync(fileUri);
        Alert.alert("Sucesso", `Dados salvos e compartilhados: ${fileUri}`);
      } catch (error) {
        console.error("Erro ao compartilhar o arquivo:", error);
        Alert.alert("Erro", "Não foi possível compartilhar o arquivo.");
      }
    }
  } catch (error) {
    console.error("Erro ao salvar e compartilhar dados:", error);
    Alert.alert("Erro", "Não foi possível salvar e compartilhar os dados.");
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    Alert.alert("Sucesso", "Todos os dados foram excluídos.");
  } catch (error) {
    console.error("Erro ao excluir dados:", error);
    Alert.alert("Erro", "Não foi possível excluir os dados.");
  }
};

const confirmClearAllData = () => {
  Alert.alert(
    "Confirmação",
    "Você tem certeza que deseja excluir todos os dados?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Excluir",
        onPress: clearAllData,
        style: "destructive"
      }
    ]
  );
};

const BackupScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Backup e Compartilhar Dados" onPress={saveAndShareData} />
      <Button title="Excluir Dados" onPress={confirmClearAllData} color="red" />
    </View>
  );
};

export default BackupScreen;