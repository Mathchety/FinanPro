import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isIncome, setIsIncome] = useState(true);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthlyBalances, setMonthlyBalances] = useState(Array(12).fill(0));
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [showIncomeList, setShowIncomeList] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      loadMonthlyBalances();
    }, [currentMonth, currentYear])
  );

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(`@transactions_${currentYear}_${currentMonth}`);
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setTransactions(parsedData.transactions);
        setBalance(parsedData.balance);
      } else {
        setTransactions([]);
        setBalance(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMonthlyBalances = async () => {
    try {
      const balances = [];
      for (let i = 0; i < 12; i++) {
        const data = await AsyncStorage.getItem(`@transactions_${currentYear}_${i}`);
        if (data !== null) {
          const parsedData = JSON.parse(data);
          balances.push(parsedData.balance);
        } else {
          balances.push(0);
        }
      }
      setMonthlyBalances(balances);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async (newTransactions, newBalance) => {
    try {
      const data = {
        transactions: newTransactions,
        balance: newBalance,
      };
      await AsyncStorage.setItem(`@transactions_${currentYear}_${currentMonth}`, JSON.stringify(data));
      loadMonthlyBalances();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!isNaN(value)) {
      const newTransaction = {
        id: transactions.length + 1,
        name,
        amount: value,
        type: isIncome ? 'Receita' : 'Despesa',
      };
      const newTransactions = [...transactions, newTransaction];
      const newBalance = isIncome ? balance + value : balance - value;
      setTransactions(newTransactions);
      setBalance(newBalance);
      saveData(newTransactions, newBalance);
    }
    setModalVisible(false);
    setName('');
    setAmount('');
  };

  const handleEdit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && selectedTransaction) {
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === selectedTransaction.id
          ? { ...transaction, name, amount: value }
          : transaction
      );
      const newBalance = updatedTransactions.reduce((acc, transaction) =>
        transaction.type === 'Receita'
          ? acc + transaction.amount
          : acc - transaction.amount,
        0
      );
      setTransactions(updatedTransactions);
      setBalance(newBalance);
      saveData(updatedTransactions, newBalance);
      setEditModalVisible(false);
    }
  };

  const handleDelete = (transaction) => {
    Alert.alert(
      'Excluir Transação',
      `Você tem certeza que deseja excluir ${transaction.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          onPress: () => {
            const newTransactions = transactions.filter(t => t.id !== transaction.id);
            const newBalance = newTransactions.reduce((acc, transaction) =>
              transaction.type === 'Receita'
                ? acc + transaction.amount
                : acc - transaction.amount,
              0
            );
            setTransactions(newTransactions);
            setBalance(newBalance);
            saveData(newTransactions, newBalance);
          }
        }
      ]
    );
  };

  const incomeTransactions = transactions.filter(transaction => transaction.type === 'Receita');
  const expenseTransactions = transactions.filter(transaction => transaction.type === 'Despesa');

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>{item.name} - R$ {item.amount.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => { setSelectedTransaction(item); setEditModalVisible(true); }} style={styles.editButton}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Controle Financeiro</Text>
        <Text style={styles.balance}>Saldo do {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</Text>
        <Text style={styles.balanceAmount}>R$ {balance.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#28a745' }]} // Verde para receitas
          onPress={() => { setIsIncome(true); setModalVisible(true); }}
        >
          <Text style={styles.addButtonText}>Adicionar Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#dc3545' }]} // Vermelho para despesas
          onPress={() => { setIsIncome(false); setModalVisible(true); }}
        >
          <Text style={styles.addButtonText}>Adicionar Despesa</Text>
        </TouchableOpacity>

        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navigationButton} onPress={handlePreviousMonth}>
            <Text style={styles.navigationButtonText}>Mês Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</Text>
          <TouchableOpacity style={styles.navigationButton} onPress={handleNextMonth}>
            <Text style={styles.navigationButtonText}>Próximo Mês</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.chartButton} onPress={() => setChartModalVisible(true)}>
          <Text style={styles.chartButtonText}>Ver Gráfico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton} onPress={() => setShowIncomeList(true)}>
          <Text style={styles.listButtonText}>Ver Receitas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton} onPress={() => setShowIncomeList(false)}>
          <Text style={styles.listButtonText}>Ver Despesas</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalViewEditar}>
          <Text style={styles.modalText}>{isIncome ? 'Adicionar Receita' : 'Adicionar Despesa'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalViewEditar}>
          <Text style={styles.modalText}>Editar Transação</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
      animationType="slide"
      transparent={true}
      visible={chartModalVisible}
      onRequestClose={() => setChartModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Gráfico Mensal de {currentYear}</Text>
          <LineChart
            data={{
              labels: Array.from({ length: 12 }, (_, i) => `${new Date(currentYear, i).toLocaleString('default', { month: 'short' })}`),
              datasets: [
                {
                  data: monthlyBalances,
                },
              ],
            }}
            width={screenWidth * 0.9}
            height={220}
            yAxisLabel="R$ "
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            bezier
            style={styles.chart}
          />
          <TouchableOpacity style={styles.button} onPress={() => setChartModalVisible(false)}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <FlatList
        data={showIncomeList ? incomeTransactions : expenseTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.transactionList}
      />
      <View style={styles.footerSpacing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    paddingBottom: 50, // Adiciona espaço na parte inferior
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  navigationButton: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  monthText: {
    fontSize: 16,
    alignSelf: 'center',
  },
  chartButton: {
    backgroundColor: '#17a2b8',
    padding: 8,
    borderRadius: 4,
    marginVertical: 5,
    alignItems: 'center',
  },
  chartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  listButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    marginVertical: 3,
    alignItems: 'center',
  },
  listButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background color
  },
  modalView: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalViewEditar: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
    left: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },  // Aumenta a altura da sombra
    shadowOpacity: 0.5,  // Aumenta a opacidade da sombra
    shadowRadius: 15,  // Aumenta o raio da sombra
    elevation: 10,  // Aumenta a elevação para dispositivos Android
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    height: 40,
    width: 280,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
    color: '#000000',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    width: 280,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 5,
    borderRadius: 4,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 4,
  },
  transactionList: {
    flex: 1,
    marginBottom: 50, // Ajuste o valor conforme necessário
  },
  footerSpacing: {
    height: 50,
  },
  
});

export default HomeScreen;
