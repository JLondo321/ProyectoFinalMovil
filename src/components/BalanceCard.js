// src/components/BalanceCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const BalanceCard = ({ balance = 0, income = 0, expenses = 0 }) => {
 const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return '$0';
  return `$${number.toLocaleString('es-CO')}`;
};

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance disponible</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-down" size={20} color="#2E7D32" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(income)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryItem}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <Ionicons name="arrow-up" size={20} color="#D32F2F" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Egresos</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(expenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 1,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  expenseIcon: {
    backgroundColor: '#FFEBEE',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
});

export default BalanceCard;
