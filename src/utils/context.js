import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error al cargar token desde AsyncStorage:', error);
            } finally {
                setIsInitialized(true);
            }
        };
        initializeAuth();
    }, []);

    const login = async (newToken) => {
        setToken(newToken);
        try {
            await AsyncStorage.setItem('token', newToken);
            await fetchUserData(newToken);
            return true;
        } catch (error) {
            console.error('Error durante login:', error);
            logout();
            throw error;
        }
    };

    const logout = useCallback(async () => {
        setToken(null);
        try {
            await AsyncStorage.removeItem('token');
        } catch (error) {
            console.error('Error al eliminar token de AsyncStorage:', error);
        }
        setUser(null);
        setResumen(null);
        setTransacciones([]);
        setLoading(false);
        setError(null);
        setLastUpdate(null);
    }, []);

    const fetchUserData = useCallback(async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            setResumen(null);
            setTransacciones([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(' Making request to:', 'http://localhost:3000/api/users/user');
            console.log(' Token being used:', currentToken ? `${currentToken.substring(0, 20)}...` : 'NO_TOKEN');

            if (currentToken) {
                try {
                    const tokenParts = currentToken.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        console.log(' Token payload:', payload);
                    }
                } catch (e) {
                    console.log(' No se pudo decodificar el token JWT');
                }
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch('http://localhost:3000/api/users/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log(' Response status:', response.status);
            console.log(' Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorMessage = `Error al cargar los datos del usuario. Status: ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.log(' Error response body:', errorData);
                    errorMessage += ` - ${errorData}`;
                } catch (e) {
                    console.log('No se pudo leer el cuerpo del error');
                }

                if (response.status === 401 || response.status === 403) {
                    await logout();
                    throw new Error('Sesión expirada o inválida');
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setUser(data.usuario || data);
            setResumen(data.resumen || null);
            setTransacciones(data.transacciones || []);
            setError(null);
            setLastUpdate(new Date().getTime());
            return data;
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setUser(null);
            setResumen(null);
            setTransacciones([]);
            if (error.name === 'AbortError') {
                setError('Tiempo de espera agotado al cargar los datos del usuario');
            } else {
                setError(error.message);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        if (!isInitialized) return;

        if (token) {
            fetchUserData(token).catch(error => {
                console.error('Error in initial user data fetch:', error);
            });
        } else {
            setUser(null);
            setResumen(null);
            setTransacciones([]);
            setLoading(false);
        }
    }, [token, fetchUserData, isInitialized]);

    const refreshUser = useCallback(async () => {
        if (!token) return null;
        try {
            const updatedUser = await fetchUserData(token);
            await new Promise(resolve => setTimeout(resolve, 100));
            return updatedUser;
        } catch (error) {
            console.error('Error al refrescar datos del usuario:', error);
            if (error.message.includes('Sesión expirada')) {
                await logout();
            }
            throw error;
        }
    }, [token, fetchUserData, logout]);

    const value = {
        token,
        user,
        resumen,
        transacciones,
        loading,
        error,
        isInitialized,
        login,
        logout,
        refreshUser,
        fetchUserData: () => fetchUserData(token),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
