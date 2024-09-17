import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'; // Importa componentes essenciais do React Native
import { useFocusEffect } from '@react-navigation/native'; // Importa hook para disparar efeitos ao focar na tela

const Dicas = () => {
    const [cdi, setCdi] = useState(null); // Estado para armazenar o valor atual do CDI
    const [selic, setSelic] = useState(null); // Estado para armazenar o valor atual da Selic
    const [exchangeRates, setExchangeRates] = useState(null); // Estado para armazenar as taxas de câmbio
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento de dados

    // Função assíncrona para buscar os dados da API
    const fetchData = async () => {
        try {
            // Requisição para obter o CDI
            const cdiResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json');
            const cdiData = await cdiResponse.json();
            
            // Requisição para obter a Selic
            const selicResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json');
            const selicData = await selicResponse.json();

            // Requisição para obter as taxas de câmbio (USD, EUR, BTC para BRL)
            const exchangeResponse = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
            const exchangeData = await exchangeResponse.json();

            // Extrai os últimos valores de CDI e Selic
            const latestCdi = cdiData[cdiData.length - 1];
            const latestSelic = selicData[selicData.length - 1];

            // Armazena os valores nos estados, com tratamento para evitar valores indefinidos
            setCdi(latestCdi ? latestCdi.valor : 'N/A');
            setSelic(latestSelic ? latestSelic.valor : 'N/A');
            setExchangeRates(exchangeData);
        } catch (error) {
            console.error(error); // Exibe erro no console em caso de falha na requisição
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    // Hook que executa a função `fetchData` quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            fetchData(); // Chama a função de buscar dados sempre que a tela é focada
        }, [])
    );

    // Mostra um indicador de carregamento enquanto os dados estão sendo buscados
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00796b" /> {/* Indicador de carregamento */}
            </View>
        );
    }

    // Exibe os dados após o carregamento
    return (
        <View style={styles.container}>
            <Text style={styles.text}>CDI: {cdi}</Text> {/* Exibe o valor do CDI */}
            <Text style={styles.text}>Selic: {selic}</Text> {/* Exibe o valor da Selic */}
            
            {/* Exibe as taxas de câmbio se os dados estiverem disponíveis */}
            {exchangeRates && (
                <>
                    <Text style={styles.text}>USD/BRL: {exchangeRates.USDBRL.bid}</Text> {/* Taxa USD/BRL */}
                    <Text style={styles.text}>EUR/BRL: {exchangeRates.EURBRL.bid}</Text> {/* Taxa EUR/BRL */}
                    <Text style={styles.text}>BTC/BRL: {exchangeRates.BTCBRL.bid}</Text> {/* Taxa BTC/BRL */}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa', // Fundo da tela
        padding: 20,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00796b', // Cor e estilo dos textos
        marginVertical: 10,
    },
});

export default Dicas; // Exporta o componente para ser usado em outras partes da aplicação
