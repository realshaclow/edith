import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from '../types';

export interface UseTimerOptions {
  targetTime?: number; // w sekundach
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (time: number) => void;
  onWarning?: (remainingTime: number) => void;
  warningThreshold?: number; // w sekundach
}

export const useTimer = (options: UseTimerOptions = {}) => {
  const {
    targetTime,
    autoStart = false,
    onComplete,
    onTick,
    onWarning,
    warningThreshold = 60
  } = options;

  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: autoStart,
    isPaused: false,
    startTime: autoStart ? new Date() : undefined,
    pausedTime: 0,
    totalTime: 0,
    targetTime
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const pauseStartRef = useRef<Date>();
  const warningFiredRef = useRef(false);

  const updateTimer = useCallback(() => {
    setTimerState(prev => {
      if (!prev.isRunning || prev.isPaused || !prev.startTime) {
        return prev;
      }

      const now = new Date();
      const elapsed = Math.floor((now.getTime() - prev.startTime.getTime()) / 1000);
      const totalTime = elapsed - prev.pausedTime;

      // Wywołaj callback onTick
      if (onTick) {
        onTick(totalTime);
      }

      // Sprawdź warning threshold
      if (targetTime && !warningFiredRef.current) {
        const remainingTime = targetTime - totalTime;
        if (remainingTime <= warningThreshold && remainingTime > 0) {
          warningFiredRef.current = true;
          if (onWarning) {
            onWarning(remainingTime);
          }
        }
      }

      // Sprawdź czy timer się skończył
      if (targetTime && totalTime >= targetTime) {
        if (onComplete) {
          onComplete();
        }
        return {
          ...prev,
          isRunning: false,
          totalTime: targetTime
        };
      }

      return {
        ...prev,
        totalTime
      };
    });
  }, [targetTime, onTick, onWarning, onComplete, warningThreshold]);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, updateTimer]);

  const start = useCallback(() => {
    const now = new Date();
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: prev.startTime || now
    }));
    warningFiredRef.current = false;
  }, []);

  const pause = useCallback(() => {
    pauseStartRef.current = new Date();
    setTimerState(prev => ({
      ...prev,
      isPaused: true
    }));
  }, []);

  const resume = useCallback(() => {
    if (pauseStartRef.current) {
      const pauseDuration = Math.floor((new Date().getTime() - pauseStartRef.current.getTime()) / 1000);
      setTimerState(prev => ({
        ...prev,
        isPaused: false,
        pausedTime: prev.pausedTime + pauseDuration
      }));
      pauseStartRef.current = undefined;
    }
  }, []);

  const stop = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false
    }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setTimerState({
      isRunning: false,
      isPaused: false,
      startTime: undefined,
      pausedTime: 0,
      totalTime: 0,
      targetTime
    });
    warningFiredRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [targetTime]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback((): number => {
    if (!targetTime) return 0;
    return Math.min((timerState.totalTime / targetTime) * 100, 100);
  }, [timerState.totalTime, targetTime]);

  const getRemainingTime = useCallback((): number => {
    if (!targetTime) return 0;
    return Math.max(targetTime - timerState.totalTime, 0);
  }, [timerState.totalTime, targetTime]);

  const isOvertime = useCallback((): boolean => {
    if (!targetTime) return false;
    return timerState.totalTime > targetTime;
  }, [timerState.totalTime, targetTime]);

  return {
    // State
    ...timerState,
    
    // Actions
    start,
    pause,
    resume,
    stop,
    reset,
    
    // Computed values
    progress: getProgress(),
    remainingTime: getRemainingTime(),
    isOvertime: isOvertime(),
    
    // Utilities
    formatTime,
    formattedTime: formatTime(timerState.totalTime),
    formattedRemainingTime: formatTime(getRemainingTime()),
    formattedTargetTime: targetTime ? formatTime(targetTime) : '00:00'
  };
};
