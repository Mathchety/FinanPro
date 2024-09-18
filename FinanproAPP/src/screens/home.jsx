import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  // State variables
  const [balance, setBalance] = useState(0); // Saldo atual
  const [modalVisible, setModalVisible] = useState(false); // Visibilidade do modal de adicionar
  const [editModalVisible, setEditModalVisible] = useState(false); // Visibilidade do modal de edição
  const [isIncome, setIsIncome] = useState(true); // Tipo de transação (receita ou despesa)
  const [name, setName] = useState(""); // Nome da transação
  const [amount, setAmount] = useState(""); // Valor da transação
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Transação selecionada para edição
  const [transactions, setTransactions] = useState([]); // Lista de transações
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Mês atual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Ano atual
  const [monthlyBalances, setMonthlyBalances] = useState(Array(12).fill(0)); // Saldo mensal
  const [chartModalVisible, setChartModalVisible] = useState(false); // Visibilidade do modal de gráfico
  const [showIncomeList, setShowIncomeList] = useState(true); // Flag para mostrar lista de receitas ou despesas

  // Atualiza os dados quando a tela recebe foco ou o mês/ano muda
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      loadMonthlyBalances();
    }, [currentMonth, currentYear])
  );

  // Carrega os dados das transações e saldo do mês atual
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(
        `@transactions_${currentYear}_${currentMonth}`
      );
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

  // Carrega os saldos mensais para o ano atual
  const loadMonthlyBalances = async () => {
    try {
      const balances = [];
      for (let i = 0; i < 12; i++) {
        const data = await AsyncStorage.getItem(
          `@transactions_${currentYear}_${i}`
        );
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

  // Salva os dados das transações e saldo no AsyncStorage
  const saveData = async (newTransactions, newBalance) => {
    try {
      const data = {
        transactions: newTransactions,
        balance: newBalance,
      };
      await AsyncStorage.setItem(
        `@transactions_${currentYear}_${currentMonth}`,
        JSON.stringify(data)
      );
      loadMonthlyBalances();
    } catch (error) {
      console.error(error);
    }
  };

  // Adiciona uma nova transação
  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!isNaN(value)) {
      const newTransaction = {
        id: transactions.length + 1,
        name,
        amount: value,
        type: isIncome ? "Receita" : "Despesa",
      };
      const newTransactions = [...transactions, newTransaction];
      const newBalance = isIncome ? balance + value : balance - value;
      setTransactions(newTransactions);
      setBalance(newBalance);
      saveData(newTransactions, newBalance);
    }
    setModalVisible(false);
    setName("");
    setAmount("");
  };

  // Edita uma transação existente
  const handleEdit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && selectedTransaction) {
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === selectedTransaction.id
          ? { ...transaction, name, amount: value }
          : transaction
      );
      const newBalance = updatedTransactions.reduce(
        (acc, transaction) =>
          transaction.type === "Receita"
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

  // Exclui uma transação com confirmação
  const handleDelete = (transaction) => {
    Alert.alert(
      "Excluir Transação",
      `Você tem certeza que deseja excluir ${transaction.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            const newTransactions = transactions.filter(
              (t) => t.id !== transaction.id
            );
            const newBalance = newTransactions.reduce(
              (acc, transaction) =>
                transaction.type === "Receita"
                  ? acc + transaction.amount
                  : acc - transaction.amount,
              0
            );
            setTransactions(newTransactions);
            setBalance(newBalance);
            saveData(newTransactions, newBalance);
          },
        },
      ]
    );
  };

  // Filtra transações por tipo (receita ou despesa)
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "Receita"
  );
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "Despesa"
  );

  // Navega para o mês anterior
  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  // Navega para o próximo mês
  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  // Renderiza um item de transação
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        {item.name} - R$ {item.amount.toFixed(2)}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction(item);
          setEditModalVisible(true);
        }}
        style={styles.editButton}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={styles.deleteButton}
      >
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e saldo */}
      <View style={styles.header}>
        <Text style={styles.title}>Controle Financeiro</Text>

        <Text>Saldo do {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</Text>


        <Text style={styles.balanceAmount}>R$ {balance.toFixed(2)}</Text>
        <View style={{ alignItems: "center" }}>
          {/* Botões para adicionar receita e despesa */}
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: "#28a745", width: 150 },
            ]} 
            onPress={() => {
              setIsIncome(true);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>Adicionar Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: "#dc3545", width: 150 },
            ]} // Vermelho para despesas
            onPress={() => {
              setIsIncome(false);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>Adicionar Despesa</Text>
          </TouchableOpacity>
        </View>
        {/* Navegação entre meses */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handlePreviousMonth}
          >
            <Text style={styles.navigationButtonText}>Mês Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </Text>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleNextMonth}
          >
            <Text style={styles.navigationButtonText}>Próximo Mês</Text>
          </TouchableOpacity>
        </View>
        {/* Botão para exibir gráfico */}
        <TouchableOpacity
          style={styles.chartButton}
          onPress={() => setChartModalVisible(true)}
        >
          <Text style={styles.chartButtonText}>Ver Gráfico</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de transações */}
      <FlatList
        data={showIncomeList ? incomeTransactions : expenseTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.transactionList}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            Nenhuma transação encontrada.
          </Text>
        }
      />

      {/* Modal para adicionar transação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {isIncome ? "Adicionar Receita" : "Adicionar Despesa"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
            <Text style={styles.submitButtonText}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para editar transação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Transação</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleEdit}>
            <Text style={styles.submitButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para exibir gráfico */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chartModalVisible}
        onRequestClose={() => setChartModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Gráfico de Saldos Mensais</Text>
          <LineChart
            data={{
              labels: [...Array(12).keys()].map((i) =>
                new Date(0, i).toLocaleString("default", { month: "short" })
              ),
              datasets: [
                {
                  data: monthlyBalances,
                },
              ],
            }}
            width={screenWidth - 40} // Ajusta a largura do gráfico
            height={220}
            yAxisLabel="R$ "
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#f0f0f0",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setChartModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 18,
    marginVertical: 10,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  navigationButton: {
    flex: 1,
    alignItems: "center",
  },
  navigationButtonText: {
    color: "#007bff",
  },
  monthText: {
    flex: 2,
    textAlign: "center",
    fontSize: 18,
  },
  chartButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
    alignItems: "center",
    marginVertical: 10,
  },
  chartButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  transactionList: {
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionText: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#ffc107",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyListText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});

export default HomeScreen;
