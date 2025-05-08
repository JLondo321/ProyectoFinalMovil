import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardStyles from '../../styles/DashboardStyles';

// Componentes
import BalanceCard from '../../components/BalanceCard';
import TransactionList from '../../components/TransactionList';

// Datos de prueba
const summaryData = {
  balance: 1250000,
  income: 2000000,
  expenses: 750000,
};

const recentTransactions = [
  { id: 1, title: 'Salario', amount: 2000000, type: 'income', category: 'Trabajo', date: '2023-05-20' },
  { id: 2, title: 'Supermercado', amount: 250000, type: 'expense', category: 'Alimentación', date: '2023-05-18' },
  { id: 3, title: 'Pago Arriendo', amount: 500000, type: 'expense', category: 'Vivienda', date: '2023-05-15' },
];

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={DashboardStyles.container}>
      {/* Header */}
      <View style={DashboardStyles.header}>
        <Text style={DashboardStyles.headerTitle}>Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <BalanceCard 
          balance={summaryData.balance}
          income={summaryData.income}
          expenses={summaryData.expenses}
        />

        {/* Quick Actions */}
        <View style={DashboardStyles.actionsContainer}>
          <Text style={DashboardStyles.sectionTitle}>Acciones rápidas</Text>
          <View style={DashboardStyles.actionButtonsContainer}>
            <TouchableOpacity 
              style={DashboardStyles.actionButton}
              onPress={() => navigation.navigate('Nueva Transacción')}
            >
              <View style={[DashboardStyles.actionIconContainer, {backgroundColor: '#e3f2fd'}]}>
                <Ionicons name="add-circle-outline" size={24} color="#1976d2" />
              </View>
              <Text style={DashboardStyles.actionText}>Nuevo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={DashboardStyles.actionButton}
              onPress={() => navigation.navigate('Transacciones')}
            >
              <View style={[DashboardStyles.actionIconContainer, {backgroundColor: '#e8f5e9'}]}>
                <Ionicons name="list-outline" size={24} color="#2e7d32" />
              </View>
              <Text style={DashboardStyles.actionText}>Listar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={DashboardStyles.actionButton}
              onPress={() => navigation.navigate('Categorías')}
            >
              <View style={[DashboardStyles.actionIconContainer, {backgroundColor: '#fff3e0'}]}>
                <Ionicons name="grid-outline" size={24} color="#ff9800" />
              </View>
              <Text style={DashboardStyles.actionText}>Categorías</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={DashboardStyles.actionButton}
              onPress={() => navigation.navigate('Análisis')}
            >
              <View style={[DashboardStyles.actionIconContainer, {backgroundColor: '#fce4ec'}]}>
                <Ionicons name="pie-chart-outline" size={24} color="#c2185b" />
              </View>
              <Text style={DashboardStyles.actionText}>Análisis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={DashboardStyles.transactionsContainer}>
          <View style={DashboardStyles.sectionTitleContainer}>
            <Text style={DashboardStyles.sectionTitle}>Transacciones recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
              <Text style={DashboardStyles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <TransactionList transactions={recentTransactions} limit={5} />
        </View>
      </ScrollView>
      
      {/*Botón flotante nueva transacción*/}
      <TouchableOpacity 
        style={DashboardStyles.fab}
        onPress={() => navigation.navigate('Nueva Transacción')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
