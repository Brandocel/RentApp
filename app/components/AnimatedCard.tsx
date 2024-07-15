import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedCardProps {
  title: string;
  description: string;
  iconSrc: string;
  onPress: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, description, iconSrc, onPress }) => {
  const animation = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, { width: screenWidth > 600 ? '30%' : '90%' }]}
    >
      <Animated.View style={[styles.cardContent, animatedStyle]}>
        <View style={styles.cardIcons}>
          <View style={styles.iconBackground}>
            <Image source={{ uri: iconSrc }} style={styles.iconImage} />
          </View>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <View style={styles.readMoreButton}>
          <Ionicons name="arrow-forward" size={24} color="#000" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    padding: 20,
  },
  cardIcons: {
    width: 140,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ffee02',
    borderWidth: 1,
    transform: [{ skewX: '-20deg' }],
  },
  iconImage: {
    width: 50,
    height: 50,
    transform: [{ skewX: '20deg' }],
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  readMoreButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderColor: '#ffee02',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default AnimatedCard;
