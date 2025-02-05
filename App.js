import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default function App() {
    const [isShaking, setIsShaking] = useState(false);
    const [sound, setSound] = useState();

    async function playSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(require('./short1.wav.wav'));
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);
        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            const acceleration = Math.sqrt(x * x + y * y + z * z);
            if (acceleration > 1.5) {
                setIsShaking(true);
                playSound();
            } else {
                setIsShaking(false);
            }
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {isShaking && <Text style={styles.text}>SHAKE</Text>}
        </View>
    );
}
