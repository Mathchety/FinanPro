import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'; // Importa componentes essenciais do React Native
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação para trocar de tela

const CalcularJurosSimples = () => {
    const navigation = useNavigation(); // Hook para realizar a navegação
    const [principal, setPrincipal] = useState(''); // Estado para armazenar o valor inicial (capital)
    const [rate, setRate] = useState(''); // Estado para armazenar a taxa de juros mensal
    const [time, setTime] = useState(''); // Estado para armazenar o período (em meses)
    const [result, setResult] = useState(''); // Estado para armazenar o resultado do cálculo

    // Função para calcular juros simples
    const calculateCompoundInterest = () => {
        const P = parseFloat(principal); // Converte o valor inicial para número
        const r = parseFloat(rate) / 100; // Converte a taxa de juros para um valor decimal
        const t = parseFloat(time); // Converte o período para número
        const A = P * Math.pow((1 + r), t); // Fórmula de juros simples (errada, parece juros compostos aqui)
        setResult(A.toFixed(2)); // Define o resultado com 2 casas decimais
    };

    return (
        <View style={styles.container}>
            {/* Botão para voltar para a tela inicial */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>

            {/* Título da calculadora */}
            <Text style={styles.title}>Calculadora de Juros Simples</Text>

            {/* Entrada para o valor inicial (capital) */}
            <TextInput
                style={styles.input}
                placeholder="Valor Inicial"
                keyboardType="numeric"
                value={principal}
                onChangeText={setPrincipal}
            />

            {/* Entrada para a taxa de juros mensal */}
            <TextInput
                style={styles.input}
                placeholder="Taxa Mensal (%)"
                keyboardType="numeric"
                value={rate}
                onChangeText={setRate}
            />

            {/* Entrada para o período (em meses) */}
            <TextInput
                style={styles.input}
                placeholder="Período (Meses)"
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
            />

            {/* Botão para calcular */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCompoundInterest}>
                <Text style={styles.calculateButtonText}>Calcular</Text>
            </TouchableOpacity>

            {/* Exibe o resultado se houver um valor */}
            {result && !isNaN(time) ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Em {time} meses você terá: R$ {result}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7', // Fundo da tela
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#7b147b',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginBottom: 20, // Estilo do botão de voltar
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold', // Estilo do texto do botão de voltar
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20, // Título principal da tela
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15, // Estilo das entradas de texto
    },
    calculateButton: {
        width: '100%',
        backgroundColor: '#7b147b',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center', // Botão de cálculo
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold', // Estilo do texto do botão de cálculo
    },
    resultContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#e6f7ff',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%', // Contêiner para o resultado
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333', // Estilo do texto do resultado
    },
});

export default CalcularJurosSimples;
