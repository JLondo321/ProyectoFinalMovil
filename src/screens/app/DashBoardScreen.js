import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardStyles from '../../styles/DashboardStyles';

// Componentes
import BalanceCard from '../../components/BalanceCard';
import TransactionList from '../../components/TransactionList';

// Contexto
import { useAuth } from '../../utils/context'; // Ajusta la ruta si es distinta

const DashboardScreen = ({ navigation }) => {
  const { resumen, transacciones } = useAuth(); // Datos obtenidos en login

  if (!resumen) {
    return (
      <View style={DashboardStyles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

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
        {/* Balance */}
        <BalanceCard
          balance={resumen.balance}
          income={resumen.income}
          expenses={resumen.expenses}
        />

        {/* Acciones rápidas */}
        <View style={DashboardStyles.actionsContainer}>
          <Text style={DashboardStyles.sectionTitle}>Acciones rápidas</Text>
          <View style={DashboardStyles.actionButtonsContainer}>
            <QuickAction
              label="Nuevo"
              icon="add-circle-outline"
              bgColor="#e3f2fd"
              iconColor="#1976d2"
              onPress={() => navigation.navigate('Nueva Transacción')}
            />
            <QuickAction
              label="Listar"
              icon="list-outline"
              bgColor="#e8f5e9"
              iconColor="#2e7d32"
              onPress={() => navigation.navigate('Transacciones')}
            />
            <QuickAction
              label="Categorías"
              icon="grid-outline"
              bgColor="#fff3e0"
              iconColor="#ff9800"
              onPress={() => navigation.navigate('Categorías')}
            />
            <QuickAction
              label="Análisis"
              icon="pie-chart-outline"
              bgColor="#fce4ec"
              iconColor="#c2185b"
              onPress={() => navigation.navigate('Análisis')}
            />
          </View>
        </View>

        {/* Transacciones recientes */}
        <View style={DashboardStyles.transactionsContainer}>
          <View style={DashboardStyles.sectionTitleContainer}>
            <Text style={DashboardStyles.sectionTitle}>Transacciones recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
              <Text style={DashboardStyles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <TransactionList transactions={transacciones.slice(0, 5)} />
        </View>
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity
        style={DashboardStyles.fab}
        onPress={() => navigation.navigate('Nueva Transacción')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const QuickAction = ({ label, icon, bgColor, iconColor, onPress }) => (
  <TouchableOpacity style={DashboardStyles.actionButton} onPress={onPress}>
    <View style={[DashboardStyles.actionIconContainer, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={DashboardStyles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export default DashboardScreen;
