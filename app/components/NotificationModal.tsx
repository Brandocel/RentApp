import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'help' | 'success' | 'warning' | 'error';
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose, type }) => {
  const messages = {
    help: {
      title: 'Help!',
      message: 'Do you have a problem? Just use this contact form.',
      backgroundColor: '#0070e0',
      icon: 'question-circle',
      iconBgColor: '#05478a',
    },
    success: {
      title: 'Success!',
      message: 'Your message has been sent successfully.',
      backgroundColor: '#03a65a',
      icon: 'check-circle',
      iconBgColor: '#005e38',
    },
    warning: {
      title: 'Warning!',
      message: 'Sorry, there was a problem with your request.',
      backgroundColor: '#fc8621',
      icon: 'exclamation-circle',
      iconBgColor: '#c24914',
    },
    error: {
      title: 'Error!',
      message: 'Change a few thing up and try submitting again.',
      backgroundColor: '#db3056',
      icon: 'times-circle',
      iconBgColor: '#851d41',
    },
  };

  const { title, message, backgroundColor, icon, iconBgColor } = messages[type];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <Animatable.View animation="bounceIn" style={[styles.card, { backgroundColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <FontAwesome name={icon as any} size={32} color="#fff" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            {message} {type === 'help' && <Text onPress={() => Linking.openURL('#')} style={styles.link}>contact form</Text>}
          </Text>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: 320,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: -32,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

export default NotificationModal;
