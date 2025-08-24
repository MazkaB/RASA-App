import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  LinearGradient
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ onLoginSuccess, onRegisterPress }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Check for saved credentials
    checkSavedCredentials();
  }, []);

  const checkSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  const shakeAnimation = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
      shakeAnimation(emailShake);
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
      shakeAnimation(emailShake);
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      shakeAnimation(passwordShake);
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      shakeAnimation(passwordShake);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    animateButton();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('savedEmail');
      }
      
      // Success animation
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        onLoginSuccess({ email, role: 'tourist' });
      });
      
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Enter your email address to receive password reset instructions.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            if (email) {
              Alert.alert('Success', `Password reset link sent to ${email}`);
            } else {
              Alert.alert('Error', 'Please enter your email address first');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSocialLogin = (provider) => {
    animateButton();
    Alert.alert(
      `${provider} Login`,
      `Continue with ${provider} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              onLoginSuccess({ email: `user@${provider.toLowerCase()}.com`, role: 'tourist' });
            }, 1500);
          },
        },
      ]
    );
  };

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ],
                },
              ]}
            >
              {/* Header Section with Better Proportions */}
              <View style={styles.headerSection}>
                <Animated.View 
                  style={[
                    styles.logoContainer,
                    { transform: [{ rotate: spin }] }
                  ]}
                >
                  <View style={styles.logoInner}>
                    <Ionicons name="airplane" size={36} color="#ffffff" />
                  </View>
                </Animated.View>
                
                <View style={styles.brandContainer}>
                  <Text style={styles.appName}>RASA</Text>
                  <Text style={styles.tagline}>Revolutionizing Asian Smart Travel</Text>
                </View>
              </View>

              {/* Welcome Section with Better Typography */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
              </View>

              {/* Form Section with Improved Spacing */}
              <View style={styles.formSection}>
                {/* Email Input with Focus State */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <Animated.View 
                    style={[
                      styles.inputContainer,
                      focusedInput === 'email' && styles.inputContainerFocused,
                      errors.email && styles.inputContainerError,
                      { transform: [{ translateX: emailShake }] }
                    ]}
                  >
                    <View style={styles.inputWrapper}>
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={focusedInput === 'email' ? '#2563eb' : '#94a3b8'} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#94a3b8"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (errors.email) {
                            setErrors({ ...errors, email: null });
                          }
                        }}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </Animated.View>
                  {errors.email && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
                      <Text style={styles.errorText}>{errors.email}</Text>
                    </View>
                  )}
                </View>

                {/* Password Input with Focus State */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <Animated.View 
                    style={[
                      styles.inputContainer,
                      focusedInput === 'password' && styles.inputContainerFocused,
                      errors.password && styles.inputContainerError,
                      { transform: [{ translateX: passwordShake }] }
                    ]}
                  >
                    <View style={styles.inputWrapper}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={focusedInput === 'password' ? '#2563eb' : '#94a3b8'} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#94a3b8"
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (errors.password) {
                            setErrors({ ...errors, password: null });
                          }
                        }}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-outline" : "eye-off-outline"} 
                          size={20} 
                          color="#94a3b8" 
                        />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                  {errors.password && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
                      <Text style={styles.errorText}>{errors.password}</Text>
                    </View>
                  )}
                </View>

                {/* Options Row with Better Alignment */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Primary Login Button with Gradient */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <View style={styles.loginButtonGradient}>
                      {isLoading ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <>
                          <Text style={styles.loginButtonText}>Sign In</Text>
                          <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>

                {/* Divider with Better Styling */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.divider} />
                </View>

                {/* Social Login with Grid Layout */}
                <View style={styles.socialGrid}>
                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('Google')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.socialIconContainer, { backgroundColor: '#fff5f5' }]}>
                      <Ionicons name="logo-google" size={20} color="#ea4335" />
                    </View>
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('Facebook')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.socialIconContainer, { backgroundColor: '#eff6ff' }]}>
                      <Ionicons name="logo-facebook" size={20} color="#1877f2" />
                    </View>
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin('Apple')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.socialIconContainer, { backgroundColor: '#f1f5f9' }]}>
                      <Ionicons name="logo-apple" size={20} color="#000000" />
                    </View>
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                </View>

                {/* Register Link with Better Styling */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>New to RASA? </Text>
                  <TouchableOpacity onPress={onRegisterPress} activeOpacity={0.7}>
                    <Text style={styles.registerLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  brandContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    letterSpacing: 0.2,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainerError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  rememberText: {
    fontSize: 14,
    color: '#64748b',
  },
  forgotText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  loginButtonGradient: {
    backgroundColor: '#2563eb',
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 13,
    color: '#94a3b8',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  socialIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialButtonText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});