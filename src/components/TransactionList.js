import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../utils/context';
import { useFocusEffect } from '@react-navigation/native';


// Componente TransactionItem
const TransactionItem = ({ transaction, categories }) => { // Recibe 'categories' como prop
  const formatCurrency = (value) => `$${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short'
    }) : 'Fecha inválida';
  };

  const getIconInfo = () => {
    // Buscar la categoría de la transacción en la lista de categorías
    const category = categories.find(cat => cat.id_categoria === transaction.categoria_id);

    // Determinar si es un ingreso o egreso para el color de fondo del círculo y el color del monto
    const isIncome = transaction.tipo_transaccion?.toLowerCase() === 'ingreso';

    // Usar el icono y color de la categoría si se encuentra, de lo contrario, usar valores predeterminados
    // El icono por defecto de la tabla es 'apps-outline', pero si no se encuentra la categoría,
    // podemos usar uno más general como 'wallet-outline'
    const iconName = category?.icono || (isIncome ? 'wallet-outline' : 'cash-outline'); 
    const iconColor = category?.color || (isIncome ? '#2E7D32' : '#D32F2F'); // Color de la categoría o verde/rojo

    // Color de fondo del círculo del icono
    // Usamos colores pastel basados en el tipo de transacción, como en la imagen de ejemplo
    const bgColor = isIncome ? '#E8F5E9' : '#FFEBEE'; 

    return { iconName, bgColor, iconColor };
  };

  const { iconName, bgColor, iconColor } = getIconInfo();

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.categoryIconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{transaction.titulo}</Text>
        {/* Usamos el nombre de la categoría de la transacción si está disponible,
            o lo buscamos en la prop categories si es necesario (asumiendo que viene en transaction.nombre_categoria) */}
        <Text style={styles.transactionCategory}>{transaction.nombre_categoria || 'Sin categoría'}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text
          style={[
            styles.transactionAmount,
            { color: transaction.tipo_transaccion?.toLowerCase() === 'ingreso' ? '#2E7D32' : '#D32F2F' }
          ]}
        >
          {transaction.tipo_transaccion?.toLowerCase() === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.monto)}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.fecha_transaccion)}</Text>
      </View>
    </View>
  );
};

// Componente TransactionList (Padre)
const TransactionList = ({ limit }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]); // Nuevo estado para categorías
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Realizar las dos peticiones en paralelo
          const [transactionsRes, userRes] = await Promise.all([
            fetch('http://localhost:3000/api/users/user', { // Esta URL trae también transacciones
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:3000/api/users/user', { // Y esta la información del usuario con categorías
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!transactionsRes.ok || !userRes.ok) {
            const errorData = await Promise.allSettled([transactionsRes.json(), userRes.json()]);
            const errorMessage = errorData
                .filter(res => res.status === 'fulfilled' && res.value && res.value.message)
                .map(res => res.value.message)
                .join(', ') || 'Error al obtener datos del usuario y transacciones';
            throw new Error(errorMessage);
          }

          const transactionsData = await transactionsRes.json();
          const userData = await userRes.json();

          setTransactions(transactionsData.transacciones || []);
          setCategories(userData.categorias || []); // Almacenar las categorías
        } catch (error) {
          console.error('Error al obtener datos:', error);
          Alert.alert('Error', error.message || 'No se pudieron cargar las transacciones y categorías.');
          setTransactions([]);
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [token])
  );

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#999" />
        <Text style={styles.emptyText}>Cargando transacciones...</Text>
      </View>
    );
  }

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
      keyExtractor={(item) => item.id_transaccion?.toString()}
      renderItem={({ item }) => (
        <TransactionItem transaction={item} categories={categories} /> // Pasa las categorías al TransactionItem
      )}
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
  categoryIconContainer: {
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
    minHeight: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
  },
});

export default TransactionList;