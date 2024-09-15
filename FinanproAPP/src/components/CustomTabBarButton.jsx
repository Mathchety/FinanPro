// src/components/CustomTabBarButton.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddOpcao from '../screens/AddOpcao';

const CustomTabBarButton = () => {
  return (
    <View style={styles.container}>
      {/* Botão Flutuante Centralizado */}
      <AddOpcao />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
});

export default CustomTabBarButton;
