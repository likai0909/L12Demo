import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

const App = () => {
    const [isShaking, setIsShaking] = useState(false);
    const [sound, setSound] = useState(null);

    // Load the sound effect
    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('./short1.wav') // Replace with your sound file
            );
            setSound(sound);
        };

        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Detect shake using
    useEffect(() => {
        const threshold = 1.5; // Adjust sensitivity
        let lastX, lastY, lastZ;

        const subscription = Gyroscope.addListener(({ x, y, z }) => {
            if (lastX !== undefined && lastY !== undefined && lastZ !== undefined) {
                const deltaX = Math.abs(x - lastX);
                const deltaY = Math.abs(y - lastY);
                const deltaZ = Math.abs(z - lastZ);

                if (deltaX + deltaY + deltaZ > threshold) {
                    setIsShaking(true);
                    playSound();

                    // Reset shake state after a short delay
                    setTimeout(() => setIsShaking(false), 500);
                }
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        });

        Gyroscope.setUpdateInterval(100); // Update interval in milliseconds

        return () => subscription.remove();
    }, [sound]);

    // Play the sound effect
    const playSound = async () => {
        if (sound) {
            await sound.replayAsync();
        }
    };

    return (
        <View style={styles.container}>
            {isShaking ? (
                <Text style={styles.shakeText}>SHAKE</Text>
            ) : (
                <Text style={styles.emptyText}></Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    shakeText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    emptyText: {
        fontSize: 24,
        color: '#000',
    },
});

export default App;
