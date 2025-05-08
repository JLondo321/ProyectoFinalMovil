// src/components/TransactionList.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionItem =({transaction}) =>{
   //Función para formatear moneda
   const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CO')}`;
   };

   //Función para formatear la fecha
   const formatDate=(dateString)=>{
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO',{day:'2-digit', month:'short'});
   };

   // Determinar iconos y colores según la categoría y tipo
  const getIconInfo = () => {
    const isIncome = transaction.type === 'income';
    
    let iconName = 'cash-outline';
    let bgColor = isIncome ? '#E8F5E9' : '#FFEBEE';
    let iconColor = isIncome ? '#2E7D32' : '#D32F2F';
    
    switch (transaction.category.toLowerCase()) {
      case 'alimentación':
        iconName = 'fast-food-outline';
        break;
      case 'vivienda':
        iconName = 'home-outline';
        break;
      case 'transporte':
        iconName = 'car-outline';
        break;
      case 'trabajo':
        iconName = 'briefcase-outline';
        break;
      case 'entretenimiento':
        iconName = 'film-outline';
        break;
      default:
        iconName = isIncome ? 'arrow-down-outline' : 'arrow-up-outline';
    }
    
    return { iconName, bgColor, iconColor };
  };

  const { iconName, bgColor, iconColor } = getIconInfo();

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.categoryIcon, { backgroundColor: bgColor }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text 
          style={[
            styles.transactionAmount, 
            { color: transaction.type === 'income' ? '#2E7D32' : '#D32F2F' }
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
      </View>
    </View>
  );
};

const TransactionList = ({ transactions, limit }) => {
  // Si hay un límite, tomar solo ese número de transacciones
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  // Si no hay transacciones, mostrar mensaje
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="documents-outline" size={40} color="#ccc" />
        <Text style={styles.emptyText}>No hay transacciones</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={displayTransactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
  },
});

export default TransactionList;

