/**
 * This example is meant to be used for temporary purposes only. Code in this
 * file should be replaced with the actual example implementation.
 */

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function Playground() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Hello world!</Text>
        <Animated.View
          style={{
            animationDuration: '10s',
            animationIterationCount: 'infinite',
            animationName: {
              0: {
                width: 200,
              },
              0.5: {
                width: 350,
              },
              1: {
                width: 200,
              },
            },
            animationTimingFunction: 'linear',
            backgroundColor: 'gray',
            height: 65,
            width: 200,
          }}>
          <View style={styles.row}>
            <View style={[styles.grow, { backgroundColor: 'blue' }]} />
            <View style={[styles.grow, { backgroundColor: 'lightblue' }]} />
            <View style={[styles.grow, { backgroundColor: 'skyblue' }]} />
            <View style={[styles.grow, { backgroundColor: 'powderblue' }]} />
          </View>

          <Animated.View
            style={{
              animationDuration: '10s',
              animationIterationCount: 'infinite',
              animationName: {
                0.1: {
                  width: '75%',
                },
                0.2: {
                  width: 20,
                },
                0.3: {
                  width: '50%',
                },
                0.4: {
                  width: 20,
                },
                0.5: {
                  width: '75%',
                },
                0.6: {
                  width: 0,
                },
                0.7: {
                  width: '100%',
                },
                0.8: {
                  width: '25%',
                },
                0.9: {
                  width: '75%',
                },
                from: {
                  width: 20,
                },
              },
              animationTimingFunction: 'linear',
              backgroundColor: 'gold',
              height: '100%',
              shadowColor: 'black',
              width: 20,
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  grow: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
