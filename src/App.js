
import { useEffect } from 'react';
import './App.css';

function App() {
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
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    
    console.log(alpha, beta, gamma)
  }
  return (
    <div className="App">

    </div>
  );
}

export default App;
