import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoItem({ video, isActive, onLike }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const likeAnimation = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(video.id);
    
    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: video.uri }}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={!isActive}
        muted={isMuted}
        onError={(error) => console.log('Video error:', error)}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Right side controls */}
        <View style={styles.rightControls}>
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Icon
                name={isLiked ? 'favorite' : 'favorite-border'}
                size={32}
                color={isLiked ? '#FF0050' : '#fff'}
              />
              <Text style={styles.actionText}>{video.likes}</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chat-bubble-outline" size={32} color="#fff" />
            <Text style={styles.actionText}>12</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={32} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Icon
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        
        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@{video.user}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  rightControls: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 25,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  bottomInfo: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    paddingRight: 80,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
});