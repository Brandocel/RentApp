import { auth } from '../../../firebaseConfig';
import React from "react";
import { Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [isSelected, setSelection] = React.useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const navigation = useNavigation();


    //metodo que cuando se entre o cargue la vista a esta vista te remueva el token de usuario y te recargue la pagina
    React.useEffect(() => {
        const removeUserToken = async () => {
            await AsyncStorage.removeItem('userToken');
        };
        removeUserToken();
    }, []);




    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleLogin = async () => {
        let valid = true;

        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo válido");
            valid = false;
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y símbolos");
            valid = false;
        } else {
            setPasswordError('');
        }

        if (valid) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const token = await userCredential.user.getIdToken();
                await AsyncStorage.setItem('userToken', token);
                Alert.alert("Inicio de sesión exitoso");
                (navigation as any).replace("App"); // Navega al drawer navigator después de un inicio de sesión exitoso
            } catch (error: any) {
                Alert.alert("Error al iniciar sesión", error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5949/5949794.png' }}
                        style={styles.gif}
                    />
                    <Text style={styles.getStarted}>Bienvenido a GolfCart</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Ingresa tu correo electrónico" 
                        placeholderTextColor="gray" 
                        keyboardType="email-address" 
                        value={email}
                        onChangeText={setEmail}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.inputPassword} 
                            placeholder="Ingresa tu contraseña" 
                            placeholderTextColor="gray" 
                            secureTextEntry={!passwordVisible} 
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity 
                            onPress={() => setPasswordVisible(!passwordVisible)} 
                            style={styles.eyeIconContainer}
                        >
                            <MaterialIcons 
                                name={passwordVisible ? "visibility" : "visibility-off"} 
                                size={24} 
                                color="grey" 
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Inicia Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    gif: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    getStarted: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: 'white',
        color: 'gray',
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 5,
    },
    inputPassword: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        color: 'gray',
    },
    eyeIconContainer: {
        padding: 15,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#A162F7',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
