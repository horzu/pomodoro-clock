
import { useState, useEffect, useRef } from 'react';
import './App.css';
import audioFile from "./breakTime.mp3";

function App() {
  const [sessionTime, setSessionTime] = useState(25*60);
  const [breakTime, setBreakTime] = useState(5*60);
  const [displayTime, setDisplayTime] = useState(25*60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  
  const audioSrc = audioFile;

  let player = useRef(null);

  useEffect(() => {
    if (displayTime <= 0) {
      setOnBreak(true);
      playSound();
    } else if (!timerOn && displayTime === breakTime) {
      setOnBreak(false);
    }
    
  }, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

  const playSound = () => {
    player.currentTime = 0;
    player.play();  
  }

  const increaseSeasion = () => {
    if(sessionTime >= 60*60){
      return;
    }
    setSessionTime(prev => prev +60);
    setDisplayTime(prev => prev +60)
  }

  const decreaseSession = () => {
    if(sessionTime <= 60){
      return;
    }
    setSessionTime(prev => prev -60)
    setDisplayTime(prev => prev -60)
  }

  const increaseBreakTime = () => {
    if(breakTime >= 60*60){
      return;
    }
    setBreakTime(prev => prev +60)
  }

  const decreaseBreakTime = () => {
    if(breakTime < 2*60){
      return;
    }
    setBreakTime(prev => prev -60)
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    )
  }


  const timerControl = () =>{

    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if(!timerOn){
        let interval = setInterval(()=> {
            date = new Date().getTime();
            if(date > nextDate){
                setDisplayTime(prev => {
                    if(prev <= 0 && !onBreakVariable){
                        //playSound();
                        onBreakVariable = true;
                        setOnBreak(true);
                        return breakTime;
                    } else if(prev <= 0 && onBreakVariable){
                        //playSound();
                        onBreakVariable = false;
                        setOnBreak(false);
                        return sessionTime;
                    }
                    return prev - 1})
                nextDate += second;
            }
        }, 30);
        localStorage.clear();
        localStorage.setItem("interval-id", interval)
    }

    if(timerOn){
        clearInterval(localStorage.getItem("interval-id"))
    }
    setTimerOn(!timerOn);
};

 
  const resetTime = () =>{
    clearInterval(localStorage.getItem("interval-id"));
    setSessionTime(25*60);
    setBreakTime(5*60);
    setDisplayTime(25*60);
    player.pause(); 
    player.currentTime = 0;    
    setTimerOn(false);
    setOnBreak(false);
  }

  return (
    <div className="App">
      <div id="header">
        <h1>25+5 Clock</h1>
      </div>
      <div className="timers">
        <div className="break container" id="break-label">
          <h2 className="headers">Break Lenght</h2>
          <div className="arrows">
            <i className="fas fa-arrow-up" id="break-increment" onClick={increaseBreakTime}></i>
            <p id="break-length">{Math.floor(breakTime/60)}</p>
            <i className="fas fa-arrow-down" id="break-decrement" onClick={decreaseBreakTime}></i>
          </div>
        </div>

        <div className="session container" id="session-label" >
          <h2 className="headers">Session Lenght</h2>
          <div className="arrows">
            <i className="fas fa-arrow-up" id="session-increment" onClick={increaseSeasion}></i>
            <p id="session-length">{Math.floor(sessionTime/60)}</p>
            <i className="fas fa-arrow-down" id="session-decrement" onClick={decreaseSession}></i>
          </div>
        </div>
      </div>

      <div id="clock-container">
        <h2 id="timer-label">{onBreak ? "Break" : "Session"}</h2>
        <p id="time-left">{formatTime(displayTime)}</p>
      </div>

      <div>
        <Controls timerOn={timerOn} timerControl={timerControl} resetTime={resetTime} />
      </div>
      <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
    </div>
  );
}

function Controls ({timerOn, timerControl, resetTime}){
  return(
    <div id="controls">
      <i id="start_stop" className={timerOn ? "fas fa-pause" :"fas fa-play"} onClick={timerControl}></i>
      <i id="reset" className="fas fa-sync" onClick={resetTime}></i>
    </div>

  )
}

export default App;
