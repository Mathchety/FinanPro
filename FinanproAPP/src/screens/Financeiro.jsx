import React from "react"; // Importa a biblioteca React para criar componentes
import { View, Text, ScrollView, SafeAreaView } from "react-native"; // Importa componentes básicos do React Native
import styles from "../styles/styles"; // Importa estilos personalizados
import ReceitaCard from "../components/ReceitaCard"; // Importa o componente ReceitaCard
import DespesaCard from "../components/DespesaCard"; // Importa o componente DespesaCard

const Financeiro = () => {
  return (
    <SafeAreaView> {/* Garantia de que o conteúdo não sobreponha áreas do dispositivo, como a barra de status */}
      <ScrollView> {/* Permite rolar o conteúdo caso seja maior que a área visível */}
        <View style={styles.container}> {/* Contêiner principal com estilo */}
          <Text style={styles.title}>Receitas</Text> {/* Título para a seção de receitas */}
          <ReceitaCard
            icon="shoppingcart" // Ícone associado à receita
            title="Compra no Mercado" // Título da receita
            description="Compras realizadas no mercado" // Descrição da receita
            value="R$ 250,00" // Valor da receita
            status="Não Pago" // Status da receita
            date="12/09/2024" // Data da receita
            tags={["Alimentos", "Supermercado"]} // Tags associadas à receita
          />

          <Text style={styles.title}>Despesas</Text> {/* Título para a seção de despesas */}
          <DespesaCard
            icon="creditcard" // Ícone associado à despesa
            title="Conta de Luz" // Título da despesa
            description="Pagamento da conta de luz" // Descrição da despesa
            value="R$ 120,00" // Valor da despesa
            status="Pago" // Status da despesa
            date="10/09/2024" // Data da despesa
            tags={["Utilidades", "Energia"]} // Tags associadas à despesa
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Financeiro; // Exporta o componente Financeiro para ser utilizado em outras partes da aplicação
