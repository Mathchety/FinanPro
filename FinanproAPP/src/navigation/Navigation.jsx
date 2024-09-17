import React from 'react'; // Importa a biblioteca React
import { createStackNavigator } from '@react-navigation/stack'; // Importa o Stack Navigator da biblioteca react-navigation
import { NavigationContainer } from '@react-navigation/native'; // Importa o container de navegação da biblioteca react-navigation
import Home from '../screens/home'; // Importa o componente Home da pasta de telas
import AddDespesas from '../screens/AddDespesas'; // Importa o componente AddDespesas da pasta de telas

// Cria o Stack Navigator
const Stack = createStackNavigator();

// Função que define o Navigator para a aplicação
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home"> {/* Define o nome da tela inicial */}
      <Stack.Screen name="Home" component={Home} /> {/* Define a tela Home */}
      <Stack.Screen name="AddDespesas" component={AddDespesas} /> {/* Define a tela AddDespesas */}
    </Stack.Navigator>
  );
}

// Componente principal de navegação
export default function Navigation() {
  return (
    <NavigationContainer> {/* Container que gerencia o estado de navegação */}
      <AppNavigator /> {/* Inclui o Stack Navigator */}
    </NavigationContainer>
  );
}
