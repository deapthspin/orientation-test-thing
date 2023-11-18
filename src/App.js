
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [chosenImage, setChosenImage] = useState('')
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

  function chooseimage() {
    let folder = require.context('./images', true)
    let imageList = folder.keys().map(image => folder(image));
    let random = Math.floor(Math.random() * imageList.length)
    let chosen = imageList[random]
    // console.log(chosen)
    setChosenImage(chosen)
  }

  function handleOrientation(event) {
    const a = event.alpha;
    const b = event.beta;
    const g = event.gamma;
    setAlpha(Math.round(a))
    setBeta(Math.round(b))
    setGamma(Math.round(g))
  }
  useEffect(() => {
    if(gamma < 15 && gamma > -15 && (beta > 170 || beta < -170)) {
      chooseimage()
    }
    
  }, [beta, gamma])
  return (
    <div className="App">
      <button onClick={handleClick}>ensable</button>
      {/* <h2>alpha: {Math.round(alpha)}</h2>
      <h2>beta: {Math.round(beta)}</h2>
      <h2>gamma: {Math.round(gamma)}</h2> */}
      {/* {} */}
      {/* {beta < 3 && beta >= -1 && gamma < 3 && gamma >= -1 && <h1>lying down</h1>}
      {beta < 95 && beta > 80 && <h1>upright</h1>} */}
      {beta <= 5 && beta >= -5 && (gamma <= -60 && gamma >= -90 || gamma <= 90 && gamma >= 60) && <img className='randImg' src={chosenImage}/>}
      {gamma < 15 && gamma > -15 && (beta > 170 || beta < -170) && <div>
        
        <h1>picking animals</h1>
      </div>}
     

    </div>
  );
}

export default App;
