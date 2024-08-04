import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';
import { IoIosSettings } from "react-icons/io";
import bell from "./belel.wav"
import breakbell from "./videoplayback (2).mp4"

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isPomodoro, setIsPomodoro] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [flowStateVisible, setFlowStateVisible] = useState(false);
  const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [userInputDuration, setUserInputDuration] = useState(0);
  const [showFlowStateMessage, setShowFlowStateMessage] = useState(false);
  const [inFlowState, setInFlowState] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newPomodoroDuration, setNewPomodoroDuration] = useState(25);
  const [newBreakDuration, setNewBreakDuration] = useState(5);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const audio = new Audio(bell)
  const break_audio = new Audio(breakbell)

  useEffect(() => {
    if ((isPomodoro || isBreak) && hasStarted && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isPomodoro, isBreak, hasStarted, isPaused]);

  useEffect(() => {
    if (!hasStarted) return;

    if (time === userInputDuration) {
      if (isPomodoro) {
        setFlowStateVisible(true);
        setTimeout(() => {
          setFlowStateVisible(false);
          setInFlowState(true);
        }, 5000);
      } else {
        break_audio.play();
        setIsBreak(false);
        setIsPomodoro(true);
        setTime(0);
        setUserInputDuration(pomodoroDuration);
        setHasStarted(false);
      }
    } else if (time > userInputDuration && isPomodoro) {
      setInFlowState(true);
    }
  }, [time, userInputDuration, isPomodoro, isBreak, hasStarted]);

  const handleStart = () => {
    setTime(0);
    setUserInputDuration(pomodoroDuration);
    setIsPomodoro(true);
    setIsBreak(false);
    setShowFlowStateMessage(false);
    setInFlowState(false);
    setHasStarted(true);
    setIsPaused(false);
  };

  const handleBreak = () => {
    setTime(0);
    setUserInputDuration(breakDuration);
    setIsBreak(true);
    setIsPomodoro(false);
    setShowFlowStateMessage(false);
    setInFlowState(false);
    setHasStarted(true);
    setIsPaused(false);
  };

  const handleFlowStateClick = () => {
    setTime(userInputDuration);
    setFlowStateVisible(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTime(0);
    setHasStarted(false);
    setIsPaused(false);
    setIsPomodoro(true);
    setIsBreak(false);
    setInFlowState(false);
    setShowFlowStateMessage(false);
    setUserInputDuration(pomodoroDuration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsSubmit = (event) => {
    event.preventDefault();
    setPomodoroDuration(newPomodoroDuration * 60);
    setBreakDuration(newBreakDuration * 60);
    setShowSettings(false);
  };

  let timerClass = '';
  if (isPomodoro) {
    timerClass = inFlowState ? 'timer-pulse-blue' : 'timer-red';
  } else if (isBreak) {
    timerClass = 'timer-orange';
  }

  return (
    <div className='container m-auto'>
      <h1 className='title is-1'>{isPomodoro ? 'Pomodoro Timer' : 'Break Timer'}</h1>
      <div className={`timer-display ${timerClass}`}>
        {formatTime(time)}
      </div>
      <div className='buttons is-centered'>
        <button className='button mr-2' onClick={handleStart}>Study Timer</button>
        <button className='button mr-2' onClick={handlePause}>{isPaused ? 'Play' : 'Pause'}</button>
        <button className='button mr-2' onClick={handleReset}>Reset</button>
        <button className='button mr-2' onClick={handleBreak}>Break Timer</button>
      </div>
      {showFlowStateMessage && (
        <div>
          <p>Start timer finished...entering flow state</p>
        </div>
      )}
      {inFlowState && isPomodoro && !isBreak && time !== 0 && (
        <div>
          <p>You are in flow state</p>
        </div>
      )}
      
      <div className='buttons is-centered'>
      <button className='button' onClick={toggleSettings}>
        <span className='icon mr-1'>
            <IoIosSettings />
        </span>
        Settings
        </button>
        
      </div>
      
      {showSettings && (
        <div>
          <form onSubmit={handleSettingsSubmit}>
            <label>
              Pomodoro Duration (minutes):
              <input
                type="number"
                value={newPomodoroDuration}
                onChange={(e) => setNewPomodoroDuration(Number(e.target.value))}
              />
            </label>
            <br />
            <label>
              Break Duration (minutes):
              <input
                type="number"
                value={newBreakDuration}
                onChange={(e) => setNewBreakDuration(Number(e.target.value))}
              />
            </label>
            <br />
            <button className='button mt-2' type="submit">Save</button>
          </form>
        </div>
      )}
      
      <p>Press Study Timer to begin studying</p>
      <p>Press settings to adjust study times - default: 25/5</p>
      <a href='https://buymeacoffee.com/engineerdom' target='__blank'>Enjoying the app? Buy Me Coffee!</a>
    </div>
  );
};

export default Timer;
