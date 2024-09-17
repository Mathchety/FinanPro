import React, { useEffect, useState } from 'react'; // Importa as bibliotecas React e Hooks
import { View, Animated, Easing } from 'react-native'; // Importa componentes e utilitários do React Native
import Icon from 'react-native-vector-icons/Ionicons'; // Importa a biblioteca de ícones Ionicons

// Componente funcional AnimatedIcon
const AnimatedIcon = ({ name, color, size }) => {
  const [scale] = useState(new Animated.Value(1)); // Cria um valor animado para a escala do ícone

  // Função para animar o ícone
  const animateIcon = () => {
    Animated.sequence([ // Sequência de animações
      Animated.timing(scale, {
        toValue: 1.5, // Aumenta o tamanho para dar o efeito de "bolha"
        duration: 200, // Duração da animação em milissegundos
        easing: Easing.out(Easing.ease), // Tipo de easing para suavizar a animação
        useNativeDriver: true, // Usa o driver nativo para melhorar o desempenho
      }),
      Animated.timing(scale, {
        toValue: 1, // Retorna ao tamanho original
        duration: 200, // Duração da animação em milissegundos
        easing: Easing.out(Easing.ease), // Tipo de easing para suavizar a animação
        useNativeDriver: true, // Usa o driver nativo para melhorar o desempenho
      }),
    ]).start(); // Inicia a sequência de animações
  };

  useEffect(() => {
    animateIcon(); // Executa a animação quando o componente é montado
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}> {/* Aplica a animação de escala */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(128, 0, 128, 0.3)', // Cor de fundo roxa com transparência
        }}
      >
        <Icon name={name} color={color} size={size} /> {/* Exibe o ícone com as propriedades passadas */}
      </View>
    </Animated.View>
  );
};

export default AnimatedIcon; // Exporta o componente para ser usado em outros lugares
