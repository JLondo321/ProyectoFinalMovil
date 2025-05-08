import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList,TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionListStyles from '../../styles/TransactionListStyles';

// Datos de ejemplo para las transacciones
const initialTransactions = [
  { id: 1, title: 'Salario', amount: 2000000, type: 'income', category: 'Trabajo', date: '2023-05-20' },
  { id: 2, title: 'Supermercado', amount: 250000, type: 'expense', category: 'Alimentación', date: '2023-05-18' },
  { id: 3, title: 'Pago Arriendo', amount: 500000, type: 'expense', category: 'Vivienda', date: '2023-05-15' },
  { id: 4, title: 'Transporte', amount: 100000, type: 'expense', category: 'Transporte', date: '2023-05-12' },
  { id: 5, title: 'Servicios', amount: 200000, type: 'expense', category: 'Vivienda', date: '2023-05-10' },
  { id: 6, title: 'Entretenimiento', amount: 150000, type: 'expense', category: 'Entretenimiento', date: '2023-05-08' },
  { id: 7, title: 'Consulta médica', amount: 80000, type: 'expense', category: 'Salud', date: '2023-05-05' },
  { id: 8, title: 'Freelance', amount: 500000, type: 'income', category: 'Trabajo', date: '2023-05-03' },
];

const TransactionListScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  // Filtrar transacciones según el texto de búsqueda y tipo
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                        (filterType === 'income' && transaction.type === 'income') ||
                        (filterType === 'expense' && transaction.type === 'expense');
    
    return matchesSearch && matchesType;
  });

  return (
    <View style={TransactionListStyles.container}>
      {/* Header de búsqueda */}
      <View style={TransactionListStyles.searchContainer}>
        <View style={TransactionListStyles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={TransactionListStyles.searchInput}
            placeholder="Buscar transacciones"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {/* Filtros */}
      <View style={TransactionListStyles.filterContainer}>
        <TouchableOpacity 
          style={[
            TransactionListStyles.filterButton,
            filterType === 'all' ? TransactionListStyles.activeFilter : null
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[
            TransactionListStyles.filterText,
            filterType === 'all' ? TransactionListStyles.activeFilterText : null
          ]}>Todos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            TransactionListStyles.filterButton,
            filterType === 'income' ? TransactionListStyles.activeFilterIncome : null
          ]}
          onPress={() => setFilterType('income')}
        >
          <Text style={[
            TransactionListStyles.filterText,
            filterType === 'income' ? TransactionListStyles.activeFilterText : null
          ]}>Ingresos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            TransactionListStyles.filterButton,
            filterType === 'expense' ? TransactionListStyles.activeFilterExpense : null
          ]}
          onPress={() => setFilterType('expense')}
        >
          <Text style={[
            TransactionListStyles.filterText,
            filterType === 'expense' ? TransactionListStyles.activeFilterText : null
          ]}>Egresos</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de transacciones */}
      <View style={TransactionListStyles.listContainer}>
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={TransactionListStyles.transactionItem}>
                  <View style={[
                    TransactionListStyles.categoryIcon, 
                    { backgroundColor: item.type === 'income' ? '#E8F5E9' : '#FFEBEE' }
                  ]}>
                    <Ionicons 
                      name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                      size={20} 
                      color={item.type === 'income' ? '#2E7D32' : '#D32F2F'} 
                    />
                  </View>
                  
                  <View style={TransactionListStyles.transactionInfo}>
                    <Text style={TransactionListStyles.transactionTitle}>{item.title}</Text>
                    <Text style={TransactionListStyles.transactionCategory}>{item.category}</Text>
                  </View>
                  
                  <View style={TransactionListStyles.transactionDetails}>
                    <Text style={[
                      TransactionListStyles.transactionAmount,
                      { color: item.type === 'income' ? '#2E7D32' : '#D32F2F' }
                    ]}>
                      {item.type === 'income' ? '+' : '-'} ${item.amount.toLocaleString('es-CO')}
                    </Text>
                    <Text style={TransactionListStyles.transactionDate}>
                      {new Date(item.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={TransactionListStyles.emptyContainer}>
            <Ionicons name="search" size={50} color="#ccc" />
            <Text style={TransactionListStyles.emptyText}>No se encontraron transacciones</Text>
          </View>
        )}
      </View>
      
      {/* Botón flotante para agregar */}
      <TouchableOpacity 
        style={TransactionListStyles.fab}
        onPress={() => navigation.navigate('Nueva Transacción')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionListScreen;