
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // Handle iOS 13+ devices.
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            window.addEventListener('devicemotion', handleOrientation);
          } else {
            console.error('Request to access the orientation was rejected');
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      window.addEventListener('devicemotion', handleOrientation);
    }
  }, [])

  function handleOrientation(event) {
    const a = event.alpha;
    const b = event.beta;
    const g = event.gamma;
    
    setAlpha(a)
    setBeta(b)
    setGamma(g)
  }
  return (
    <div className="App">
      <h1>alpha: {alpha}</h1>
      <h1>beta: {beta}</h1>
      <h1>gamma: {gamma}</h1>
    </div>
  );
}

export default App;
