import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'; // Importa os componentes necessários do React Native
import { useNavigation } from '@react-navigation/native'; // Importa o hook para navegação entre telas

const CalcularJurosCompostos = () => {
    const navigation = useNavigation(); // Hook para navegação entre telas
    const [principal, setPrincipal] = useState(''); // Armazena o valor do capital inicial
    const [rate, setRate] = useState(''); // Armazena a taxa de juros anual
    const [months, setMonths] = useState(''); // Armazena o período em meses
    const [monthlyContribution, setMonthlyContribution] = useState(''); // Armazena o aporte mensal
    const [result, setResult] = useState(null); // Armazena o resultado do cálculo

    const calculateCompoundInterest = () => {
        // Conversão dos valores de entrada para tipos numéricos
        const P = parseFloat(principal); 
        const r = parseFloat(rate) / 100 / 12; // Calcula a taxa de juros mensal
        const n = parseInt(months); // Número de meses
        const C = parseFloat(monthlyContribution); // Aporte mensal

        // Cálculo dos juros compostos
        let total = P;
        for (let i = 0; i < n; i++) {
            total = (total + C) * (1 + r); // Juros compostos com aportes mensais
        }

        setResult(total.toFixed(2)); // Define o resultado arredondado para 2 casas decimais
    };

    return (
        <View style={styles.container}>
            {/* Botão para voltar à tela inicial */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Calculadora de Juros Compostos</Text>

            {/* Entrada de Capital Inicial */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Capital Inicial:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={principal}
                    onChangeText={setPrincipal}
                    placeholder="Ex: 1000"
                />
            </View>

            {/* Entrada da Taxa de Juros Anual */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Taxa de Juros Anual (%):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={rate}
                    onChangeText={setRate}
                    placeholder="Ex: 5"
                />
            </View>

            {/* Entrada do Período (meses) */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Período (meses):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={months}
                    onChangeText={setMonths}
                    placeholder="Ex: 12"
                />
            </View>

            {/* Entrada do Aporte Mensal */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Aporte Mensal:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    placeholder="Ex: 100"
                />
            </View>

            {/* Botão para calcular os juros compostos */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCompoundInterest}>
                <Text style={styles.calculateButtonText}>Calcular</Text>
            </TouchableOpacity>

            {/* Exibição do resultado se houver */}
            {result !== null && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Resultado: R$ {result}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7', // Fundo da tela
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20, // Estilo do título da calculadora
    },
    inputContainer: {
        marginBottom: 15, // Contêiner para entradas de texto
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5, // Rótulos para os campos de entrada
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff', // Estilos para os campos de entrada
    },
    calculateButton: {
        backgroundColor: '#7b147b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20, // Estilo do botão de cálculo
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold', // Estilo do texto no botão de cálculo
    },
    resultContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#e0e4e5',
        borderRadius: 8,
        alignItems: 'center', // Estilo do contêiner que exibe o resultado
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333', // Estilo do texto do resultado
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#7b147b',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginBottom: 20, // Estilo do botão de voltar para a tela inicial
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold', // Estilo do texto no botão de voltar
    },
});

export default CalcularJurosCompostos;
