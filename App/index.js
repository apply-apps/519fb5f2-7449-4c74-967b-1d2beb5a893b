// Filename: index.js
// Combined code from all files
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Alert, TouchableOpacity, Dimensions, Platform } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 16; // 16x16 grid

const directions = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const getRandomPosition = () => {
    const max = BOARD_SIZE - 1;
    return {
        x: Math.floor(Math.random() * max),
        y: Math.floor(Math.random() * max),
    };
};

const App = () => {
    const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
    const [direction, setDirection] = useState(directions.RIGHT);
    const [food, setFood] = useState(getRandomPosition);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(moveSnake, 200);
        return () => clearInterval(timerRef.current);
    }, [snake, direction]);

    const moveSnake = () => {
        const newHead = { 
            x: snake[0].x + direction.x, 
            y: snake[0].y + direction.y 
        };

        if (checkCollision(newHead)) {
            Alert.alert('Game Over', `Your score is ${score}`);
            setSnake([{ x: 8, y: 8 }]);
            setDirection(directions.RIGHT);
            setFood(getRandomPosition);
            setScore(0);
            return;
        }
        
        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(getRandomPosition);
            setScore(score + 1);
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    const checkCollision = (head) => {
        if (
            head.x < 0 || head.x >= BOARD_SIZE || 
            head.y < 0 || head.y >= BOARD_SIZE || 
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            return true;
        }
        return false;
    };

    const changeDirection = (newDirection) => {
        if (
            (direction.x + newDirection.x !== 0 || direction.y + newDirection.y !== 0) // Preventing reverse direction
        ) {
            setDirection(newDirection);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.board}>
                {Array.from({ length: BOARD_SIZE }).map((_, rowIdx) => (
                    <View key={rowIdx} style={styles.row}>
                        {Array.from({ length: BOARD_SIZE }).map((_, colIdx) => (
                            <View 
                                key={colIdx}
                                style={[
                                    styles.cell, 
                                    snake.some(segment => segment.x === colIdx && segment.y === rowIdx) &&
                                    styles.snake,
                                    food.x === colIdx && food.y === rowIdx && styles.food
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
            <Text style={styles.score}>Score: {score}</Text>
            <View style={styles.controls}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => changeDirection(directions.UP)} style={styles.control}>
                        <Text style={styles.controlText}>↑</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => changeDirection(directions.LEFT)} style={styles.control}>
                        <Text style={styles.controlText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.controlSpacer} />
                    <TouchableOpacity onPress={() => changeDirection(directions.RIGHT)} style={styles.control}>
                        <Text style={styles.controlText}>→</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => changeDirection(directions.DOWN)} style={styles.control}>
                        <Text style={styles.controlText}>↓</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Padding for Android status bar
    },
    board: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    snake: {
        backgroundColor: 'green',
    },
    food: {
        backgroundColor: 'red',
    },
    score: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    controls: {
        marginTop: 20,
    },
    control: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 30,
    },
    controlSpacer: {
        width: 60, // Same width as control to space correctly
    },
    controlText: {
        fontSize: 30,
    },
});

export default App;