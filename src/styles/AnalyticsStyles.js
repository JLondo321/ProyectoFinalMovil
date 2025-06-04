import { StyleSheet } from 'react-native';

const AnalyticsStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'flex-start', // Alinea el contenido a la izquierda
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 5,
    // No necesitamos alignSelf: 'flex-start' si el contenedor ya es flex-start
  },
  cardTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardValueGreen: {
    color: '#2E7D32', // Un verde para ingresos
  },
  cardValueRed: {
    color: '#D32F2F', // Un rojo para gastos
  },
  cardValueBlue: {
    color: '#03A9F4', // Un azul para ahorro
  },
  cardValueDefault: {
    color: '#333', // Color por defecto para otros valores
  },
  categorySection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categorySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    flexDirection: 'row', // Para alinear icono y texto en el título
    alignItems: 'center',
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default AnalyticsStyles;