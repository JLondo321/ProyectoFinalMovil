// src/components/TransactionListScreen.js
import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,FlatList,TextInput,ActivityIndicator,Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionListStyles from '../../styles/TransactionListStyles';
import { useAuth } from '../../utils/context';

const TransactionListScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/transactions/lista', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar transacciones');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  // Filtrar transacciones según el texto de búsqueda y tipo
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      tx.categoria?.toLowerCase().includes(searchText.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      (filterType === 'income' && tx.tipo_transaccion === 'ingreso') ||
      (filterType === 'expense' && tx.tipo_transaccion === 'egreso');

    return matchesSearch && matchesType;
  });

  // Render mientras carga
  if (loading) {
    return (
      <View style={TransactionListStyles.emptyContainer}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={TransactionListStyles.emptyText}>Cargando transacciones...</Text>
      </View>
    );
  }

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
            filterType === 'all' ? TransactionListStyles.activeFilter : null,
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text
            style={[
              TransactionListStyles.filterText,
              filterType === 'all' ? TransactionListStyles.activeFilterText : null,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            TransactionListStyles.filterButton,
            filterType === 'income' ? TransactionListStyles.activeFilterIncome : null,
          ]}
          onPress={() => setFilterType('income')}
        >
          <Text
            style={[
              TransactionListStyles.filterText,
              filterType === 'income' ? TransactionListStyles.activeFilterText : null,
            ]}
          >
            Ingresos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            TransactionListStyles.filterButton,
            filterType === 'expense' ? TransactionListStyles.activeFilterExpense : null,
          ]}
          onPress={() => setFilterType('expense')}
        >
          <Text
            style={[
              TransactionListStyles.filterText,
              filterType === 'expense' ? TransactionListStyles.activeFilterText : null,
            ]}
          >
            Egresos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de transacciones */}
      <View style={TransactionListStyles.listContainer}>
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id_transaccion.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={TransactionListStyles.transactionItem}>
                  <View
                    style={[
                      TransactionListStyles.categoryIcon,
                      {
                        backgroundColor:
                          item.tipo_transaccion === 'ingreso' ? '#E8F5E9' : '#FFEBEE',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icono || (item.tipo_transaccion === 'ingreso' ? 'arrow-up' : 'arrow-down')}
                      size={20}
                      color={item.tipo_transaccion === 'ingreso' ? '#2E7D32' : '#D32F2F'}
                    />
                  </View>

                  <View style={TransactionListStyles.transactionInfo}>
                    <Text style={TransactionListStyles.transactionTitle}>{item.titulo}</Text>
                    <Text style={TransactionListStyles.transactionCategory}>
                      {item.categoria}
                    </Text>
                  </View>

                  <View style={TransactionListStyles.transactionDetails}>
                    <Text
                      style={[
                        TransactionListStyles.transactionAmount,
                        {
                          color:
                            item.tipo_transaccion === 'ingreso' ? '#2E7D32' : '#D32F2F',
                        },
                      ]}
                    >
                      {item.tipo_transaccion === 'ingreso' ? '+' : '-'} $
                      {parseFloat(item.monto).toLocaleString('es-CO')}
                    </Text>
                    <Text style={TransactionListStyles.transactionDate}>
                      {new Date(item.fecha_transaccion).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={TransactionListStyles.emptyContainer}>
            <Ionicons name="documents-outline" size={50} color="#ccc" />
            <Text style={TransactionListStyles.emptyText}>
              No se encontraron transacciones
            </Text>
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
