
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
    setAlpha(Math.round(a))
    setBeta(Math.round(b))
    setGamma(Math.round(g))
  }
  return (
    <div className="App">
      <button onClick={handleClick}>ensable</button>
      <h2>alpha: {Math.round(alpha)}</h2>
      <h2>beta: {Math.round(beta)}</h2>
      <h2>gamma: {Math.round(gamma)}</h2>
      {beta < 3 && beta > -1 && gamma < 3 && gamma > -1 && <h1>lying down</h1>}
      {beta < 95 && beta > 80 && <h1>upright</h1>}
      {gamma < 5 && gamma > -5 && (beta > 170 || beta < -170) && <h1>facing down</h1>}
      {beta <= 1 && beta >= -1 && (gamma < -80 && gamma > -90 || gamma < 90 && gamma > 80) && <h1>landscape</h1>}
      
      <h1>{message}</h1>
    </div>
  );
}

export default App;
