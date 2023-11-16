
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // Handle iOS 13+ devices.
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            console.log('k')
          } else {
            console.error('Request to access the orientation was rejected');
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      console.log('pas')
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }



  function handleOrientation(event) {
    const a = event.alpha;
    const b = event.beta;
    const g = event.gamma;
    console.log(event.alpha)
    setAlpha(a)
    setBeta(b)
    setGamma(g)
  }
  return (
    <div className="App">
      <button onClick={handleClick}>enable</button>
      <h2>alpha: {Math.round(alpha)}</h2>
      <h2>beta: {Math.round(beta)}</h2>
      <h2>gamma: {Math.round(gamma)}</h2>
      {Math.round(beta) < 3 && Math.round(beta) > -1 && Math.round(gamma) < 3 && Math.round(gamma) > -1 && <h1>lying down</h1>}
      {Math.round(beta) < 95 && Math.round(beta) > 80 && <h1>upright</h1>}
      {Math.round(gamma) < 5 && Math.round(gamma) > -5 && <h1>facing down</h1>}
      {Math.round(gamma) < 90 && Math.round(gamma) > 80 && Math.round(beta) < 1 && Math.round(beta) >= 0 && <h1>landscape</h1>}
      
      <h1>{message}</h1>
    </div>
  );
}

export default App;
