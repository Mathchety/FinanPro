import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Biblioteca para armazenar dados localmente no dispositivo
import { Picker } from "@react-native-picker/picker"; // Componente para criar dropdowns
import { useNavigation } from "@react-navigation/native"; // Hook para navegação

const AcompanharRendimentoCdi = () => {
  const navigation = useNavigation(); // Hook para navegar entre telas
  const [investedAmount, setInvestedAmount] = useState(""); // Estado para armazenar o valor investido
  const [monthlyContribution, setMonthlyContribution] = useState(""); // Estado para o aporte mensal
  const [currentAmount, setCurrentAmount] = useState(0); // Estado que guarda o valor atual
  const [cdiRate, setCdiRate] = useState(0); // Estado para armazenar a taxa CDI diária
  const [projecaoSemana, setProjecaoSemana] = useState(0); // Projeção de rendimento em 1 semana
  const [projecaoMes, setProjecaoMes] = useState(0); // Projeção de rendimento em 1 mês
  const [rendimentoSemana, setRendimentoSemana] = useState(0); // Rendimento para 1 semana
  const [rendimentoMes, setRendimentoMes] = useState(0); // Rendimento para 1 mês
  const [rendimentoLiquidoSemana, setRendimentoLiquidoSemana] = useState(0); // Rendimento líquido de 1 semana, já descontando impostos
  const [rendimentoLiquidoMes, setRendimentoLiquidoMes] = useState(0); // Rendimento líquido de 1 mês
  const [projecaoAno, setProjecaoAno] = useState(0); // Projeção de rendimento em 1 ano
  const [projecaoCincoAnos, setProjecaoCincoAnos] = useState(0); // Projeção de rendimento em 5 anos
  const [projecaoDezAnos, setProjecaoDezAnos] = useState(0); // Projeção de rendimento em 10 anos
  const [rendimentoLiquidoAno, setRendimentoLiquidoAno] = useState(0); // Rendimento líquido de 1 ano
  const [rendimentoLiquidoCincoAnos, setRendimentoLiquidoCincoAnos] = useState(0); // Rendimento líquido de 5 anos
  const [rendimentoLiquidoDezAnos, setRendimentoLiquidoDezAnos] = useState(0); // Rendimento líquido de 10 anos
  const [selectedOption, setSelectedOption] = useState(""); // Estado para a opção selecionada no dropdown

  useEffect(() => {
    // Função para buscar a taxa CDI
    const fetchCdiRate = async () => {
      try {
        const response = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json"
        );
        const data = await response.json();
        const latestCdi = data[data.length - 1].valor;
        setCdiRate(latestCdi / 30); // CDI diário
      } catch (error) {
        console.error("Error fetching CDI rate:", error);
      }
    };

    // Função para carregar os dados armazenados (valor atual)
    const loadStoredData = async () => {
      try {
        const storedAmount = await AsyncStorage.getItem("currentAmount");
        if (storedAmount !== null) {
          setCurrentAmount(parseFloat(storedAmount));
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    fetchCdiRate(); // Busca a taxa CDI
    loadStoredData(); // Carrega os dados do AsyncStorage
  }, []);

  useEffect(() => {
    // Função que atualiza o valor investido diariamente com base no CDI
    const updateAmount = async () => {
      if (currentAmount > 0 && cdiRate > 0) {
        const newAmount = currentAmount + currentAmount * (cdiRate / 100); // Aplica o CDI diário ao valor atual
        setCurrentAmount(newAmount);
        await AsyncStorage.setItem("currentAmount", newAmount.toString()); // Salva o novo valor no AsyncStorage
      }
    };

    const interval = setInterval(updateAmount, 24 * 60 * 60 * 1000); // Atualiza a cada 24 horas

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, [currentAmount, cdiRate]);

  useEffect(() => {
    // Calcula as projeções de rendimento sempre que o valor atual ou a taxa CDI mudam
    if (currentAmount > 0 && cdiRate > 0) {
      calcularProjecoes(currentAmount);
    }
  }, [currentAmount, cdiRate]);

  // Função acionada ao clicar em "Investir"
  const handleInvest = () => {
    const amount = parseFloat(investedAmount); // Converte o valor investido para número
    const contribution = parseFloat(monthlyContribution); // Converte o aporte mensal para número
    if (!isNaN(amount)) {
      setCurrentAmount(amount); // Define o valor atual
      AsyncStorage.setItem("currentAmount", amount.toString()); // Armazena o valor no AsyncStorage
      calcularProjecoes(amount, contribution); // Calcula as projeções
    }
  };

  // Função para calcular as projeções de rendimento com base no CDI
  const calcularProjecoes = (amount, contribution = 0) => {
    const cdiDiario = cdiRate / 100;
    const rendimentoSemana = amount * cdiDiario * 5; // Calcula o rendimento para 1 semana (5 dias úteis)
    const rendimentoMes = amount * cdiDiario * 21; // Calcula o rendimento para 1 mês (21 dias úteis)
    const projecaoSemana = amount + rendimentoSemana;
    const projecaoMes = amount + rendimentoMes;

    // Calcula o imposto sobre o rendimento
    const impostoSemana = rendimentoSemana * 0.225; // 22.5% de imposto para até 180 dias
    const impostoMes = rendimentoMes * 0.225;

    // Calcula o rendimento líquido (descontando o imposto)
    const rendimentoLiquidoSemana = rendimentoSemana - impostoSemana;
    const rendimentoLiquidoMes = rendimentoMes - impostoMes;

    // Atualiza os estados com as projeções e rendimentos
    setRendimentoSemana(rendimentoSemana.toFixed(2));
    setRendimentoMes(rendimentoMes.toFixed(2));
    setProjecaoSemana(projecaoSemana.toFixed(2));
    setProjecaoMes(projecaoMes.toFixed(2));
    setRendimentoLiquidoSemana(rendimentoLiquidoSemana.toFixed(2));
    setRendimentoLiquidoMes(rendimentoLiquidoMes.toFixed(2));

    // Projeções para 1 ano, 5 anos e 10 anos
    const rendimentoAno = calcularRendimentoComAportes(amount, contribution, 252); // Calcula rendimento para 1 ano (252 dias úteis)
    const rendimentoCincoAnos = calcularRendimentoComAportes(amount, contribution, 252 * 5); // Calcula rendimento para 5 anos
    const rendimentoDezAnos = calcularRendimentoComAportes(amount, contribution, 252 * 10); // Calcula rendimento para 10 anos

    // Calcula o imposto para cada período
    const impostoAno = rendimentoAno * 0.175; // 17.5% para 361 a 720 dias
    const impostoCincoAnos = rendimentoCincoAnos * 0.15; // 15% para mais de 720 dias
    const impostoDezAnos = rendimentoDezAnos * 0.15;

    // Calcula o rendimento líquido para cada período
    const rendimentoLiquidoAno = rendimentoAno - impostoAno;
    const rendimentoLiquidoCincoAnos = rendimentoCincoAnos - impostoCincoAnos;
    const rendimentoLiquidoDezAnos = rendimentoDezAnos - impostoDezAnos;

    // Atualiza os estados com as projeções e rendimentos líquidos
    setProjecaoAno((amount + rendimentoLiquidoAno).toFixed(2));
    setProjecaoCincoAnos((amount + rendimentoLiquidoCincoAnos).toFixed(2));
    setProjecaoDezAnos((amount + rendimentoLiquidoDezAnos).toFixed(2));
    setRendimentoLiquidoAno(rendimentoLiquidoAno.toFixed(2));
    setRendimentoLiquidoCincoAnos(rendimentoLiquidoCincoAnos.toFixed(2));
    setRendimentoLiquidoDezAnos(rendimentoLiquidoDezAnos.toFixed(2));
  };

  // Função para calcular o rendimento com aportes mensais
  const calcularRendimentoComAportes = (amount, contribution, days) => {
    let total = amount;
    const cdiDiario = cdiRate / 100;

    for (let i = 0; i < days; i++) {
      total += total * cdiDiario;
      if (i % 21 === 0) {
        total += contribution; // Adiciona o aporte mensal a cada 21 dias
      }
    }
    return total - amount; // Retorna o rendimento total
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Rendimento CDI</Text>

      {/* Campo para inserir o valor investido */}
      <TextInput
        style={styles.input}
        placeholder="Valor investido"
        value={investedAmount}
        onChangeText={setInvestedAmount}
        keyboardType="numeric"
      />

      {/* Campo para inserir o aporte mensal */}
      <TextInput
        style={styles.input}
        placeholder="Aporte mensal"
        value={monthlyContribution}
        onChangeText={setMonthlyContribution}
        keyboardType="numeric"
      />

      {/* Botão para acionar o cálculo */}
      <TouchableOpacity onPress={handleInvest} style={styles.button}>
        <Text style={styles.buttonText}>Investir</Text>
      </TouchableOpacity>

      {/* Exibe os resultados calculados */}
      <Text>Rendimento semanal: {rendimentoLiquidoSemana}</Text>
      <Text>Rendimento mensal: {rendimentoLiquidoMes}</Text>
      <Text>Projeção em 1 ano: {projecaoAno}</Text>
      <Text>Projeção em 5 anos: {projecaoCincoAnos}</Text>
      <Text>Projeção em 10 anos: {projecaoDezAnos}</Text>
    </View>
  );
};

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AcompanharRendimentoCdi;
