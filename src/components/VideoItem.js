import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fontStyles from '../Styles/fontStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoItem = ({ video, isActive, onLike }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [isPaused, setIsPaused] = useState(false);
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  // Get safe area insets
  const insets = useSafeAreaInsets();

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(video.id);

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

  const handlePressIn = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!isActive || isPaused}
          muted={isMuted}
          onError={error => console.log('Video error:', error)}
        />

       
        {isPaused && (
          <View style={styles.pauseOverlay}>
            <Icon name="pause" size={60} color="#fff" />
          </View>
        )}

       
        <View style={styles.overlay} pointerEvents="box-none">
         
          <View style={[styles.rightControls, { bottom: 100 + insets.bottom }]}>
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

            <TouchableOpacity style={styles.actionButton} onPress={() => setIsMuted(!isMuted)}>
              <Icon name={isMuted ? 'volume-off' : 'volume-up'} size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bottom info */}
          <View style={[styles.bottomInfo, { paddingBottom: 120 + insets.bottom }]}>
            <Text style={styles.username}>@{video.user}</Text>
            <Text style={styles.description}>{video.description}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    ...fontStyles.Montserrat_Regular,
  },
  bottomInfo: {
    paddingHorizontal: 15,
    paddingRight: 80,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    ...fontStyles.Montserrat_Bold,
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    ...fontStyles.Montserrat_Regular,
  },
});
export default VideoItem;