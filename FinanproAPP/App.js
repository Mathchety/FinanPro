// Importações necessárias para o funcionamento do app
import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native'; // Contêiner para navegação
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Cria um navegador com abas na parte inferior
import { createStackNavigator } from '@react-navigation/stack'; // Cria um navegador em pilha
import Icon from 'react-native-vector-icons/Ionicons'; // Biblioteca de ícones
import { View, Text } from 'react-native'; // Componentes básicos do React Native
import Home from './src/screens/home'; // Tela inicial (Home)
import Financeiro from './src/screens/Financeiro'; // Tela de financeiro
import Dicas from './src/screens/Dicas'; // Tela de dicas
import Backup from './src/screens/Backup'; // Tela de backup
import CustomTabBarButton from './src/components/CustomTabBarButton'; // Componente customizado para o botão de tab
import styles from './src/styles/styles'; // Importa os estilos globais
import { Modal } from 'react-native-paper'; // Modal para navegação com o botão central
import CalcularJurosSimples from './src/screens/CalcularJurosSimples'; // Tela para calcular juros simples
import CalcularJurosCompostos from './src/screens/CalcularJurosCompostos'; // Tela para calcular juros compostos
import AcompanharRendimentoCdi from './src/screens/AcompanharRendimentoCdi'; // Tela para acompanhar rendimento do CDI

// Cria o Stack Navigator, responsável pela navegação em pilha
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer> {/* Container que encapsula toda a navegação */}
      <Stack.Navigator
        screenOptions={{ headerShown: false }} // Remove os cabeçalhos automáticos das telas
      >
        {/* Define a tela inicial como "Main", que carrega o Tab Navigator */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        
        {/* Define outras telas do Stack Navigator */}
        <Stack.Screen name="CalcularJurosCompostos" component={CalcularJurosCompostos} />
        <Stack.Screen name="CalcularJurosSimples" component={CalcularJurosSimples} />
        <Stack.Screen name="AcompanharRendimentoCdi" component={AcompanharRendimentoCdi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Cria o Bottom Tab Navigator, responsável pela navegação por abas
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false, // Esconde os rótulos das abas
      tabBarStyle: {
        position: 'absolute', // Posiciona a barra de abas na parte inferior
        bottom: 25, // Margem inferior da barra de navegação
        left: 20,
        right: 20,
        elevation: 0, // Remove sombra
        backgroundColor: '#ffffff', // Cor de fundo da barra
        borderRadius: 15, // Cantos arredondados
        height: 80, // Altura da barra
        paddingBottom: 10, // Espaçamento no final da barra
        ...styles.shadow, // Aplica sombra (definida no arquivo de estilos)
      },
      tabBarItemStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarActiveTintColor: '#7b147b', // Cor quando a aba está ativa
      tabBarInactiveTintColor: '#777', // Cor quando a aba está inativa
    }}
  >
    {/* Tela Home (primeira aba) */}
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, focused }) => ( // Exibe ícone e texto na aba
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="home-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Home</Text>
          </View>
        ),
      }}
    />

    {/* Tela Financeiro (segunda aba) */}
    <Tab.Screen
      name="Financeiro"
      component={Financeiro}
      options={{
        tabBarIcon: ({ color, focused }) => ( // Exibe ícone e texto na aba
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="wallet-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Financeiro</Text>
          </View>
        ),
      }}
    />

    {/* Botão central personalizado para adicionar (Add) */}
    <Tab.Screen
      name="Add"
      component={Modal} // O componente modal é carregado ao clicar
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="add-circle" color={focused ? '#7b147b' : '#fff'} size={60} />
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />, // Botão customizado
      }}
    />

    {/* Tela Dicas (quarta aba) */}
    <Tab.Screen
      name="Dicas"
      component={Dicas}
      options={{
        tabBarIcon: ({ color, focused }) => ( // Exibe ícone e texto na aba
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="bulb-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Dicas</Text>
          </View>
        ),
      }}
    />

    {/* Tela Backup (quinta aba) */}
    <Tab.Screen
      name="Backup"
      component={Backup}
      options={{
        tabBarIcon: ({ color, focused }) => ( // Exibe ícone e texto na aba
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="cloud-upload-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Backup</Text>
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default App; // Exporta o componente principal da aplicação
