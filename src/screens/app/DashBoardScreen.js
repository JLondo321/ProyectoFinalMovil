import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, TouchableOpacity,Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DashboardStyles from '../../styles/DashboardStyles';

// Componentes
import BalanceCard from '../../components/BalanceCard';
import TransactionList from '../../components/TransactionList';

// Contexto
import { useAuth } from '../../utils/context'; // Ajusta la ruta si es distinta

const DashboardScreen = ({ navigation }) => {
  const { token } = useAuth();
  const { transacciones } = useAuth(); // Datos obtenidos en login
  const [resumen, setResumen] = useState({
    ingresos_totales: 0,
    egresos_totales: 0,
    saldo_disponible: 0,
  });

  useFocusEffect(
  useCallback(() => {
    const fetchResumen = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('No se pudo cargar el resumen');
        const data = await response.json();

        const resumenConvertido = {
          ingresos_totales: parseFloat(data.resumen.ingresos_totales),
          egresos_totales: parseFloat(data.resumen.egresos_totales),
          saldo_disponible: parseFloat(data.resumen.saldo_disponible),
        };

        console.log('Resumen formateado:', resumenConvertido);
        setResumen(resumenConvertido);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchResumen();
  }, [token])
);

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
        balance={resumen.saldo_disponible}
        income={resumen.ingresos_totales}
        expenses={resumen.egresos_totales}
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
         <TransactionList transactions={transacciones} limit={5} />

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
