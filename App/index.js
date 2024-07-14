// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function App() {
  const [hero, setHero] = useState('');
  const [villain, setVillain] = useState('');
  const [plot, setPlot] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const getStory = async () => {
    if (!hero || !villain || !plot) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true);
    setStory('');

    try {
      const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
        messages: [
          { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
          { role: "user", content: `Create a fairy tale with the hero ${hero}, villain ${villain}, and plot ${plot}.` }
        ],
        model: "gpt-4o"
      });

      setStory(response.data.response);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Fairy Tale Generator</Text>
        <TextInput
          style={styles.input}
          placeholder="Hero"
          value={hero}
          onChangeText={setHero}
        />
        <TextInput
          style={styles.input}
          placeholder="Villain"
          value={villain}
          onChangeText={setVillain}
        />
        <TextInput
          style={styles.input}
          placeholder="Plot"
          value={plot}
          onChangeText={setPlot}
        />
        <Button title="Generate Story" onPress={getStory} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {story && (
          <View style={styles.storyBox}>
            <Text style={styles.storyText}>{story}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 15,
  },
  storyBox: {
    backgroundColor: '#E5E5E5',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  storyText: {
    fontSize: 16,
  },
});