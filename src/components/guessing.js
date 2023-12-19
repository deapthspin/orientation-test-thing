
import { useEffect, useRef, useState } from 'react';
import '../App.css';

function Guessing(props) {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [chosenImage, setChosenImage] = useState('')
  // const [correctAns, setCorrectAns] = useState('')
  const [options, setOptions] = useState([])
  let [score, setScore] = useState(0)
  const [qnComplete, setQnComplete] = useState(false)
  let [questionsCompleted, setQuestionsCompleted] = useState(0)
  const [finished, setFinished] = useState(false)
  let [numComplete, setNumComplete] = useState(0)
  let [intervalid, setIntervalid] = useState (0)
  const {playernum, roomId, isowner, playerlist, username} = props
  let [secondsLeft, setSecondsLeft] = useState(0)
  let [plrScores, setPlrScores] = useState([])
  const ws = useRef()

  // const handleClick = () => {
  //   if (typeof DeviceMotionEvent.requestPermission === 'function') {
  //     // Handle iOS 13+ devices.
  //     DeviceMotionEvent.requestPermission()
  //       .then((state) => {
  //         if (state === 'granted') {
  //           window.addEventListener('deviceorientation', handleOrientation);
  //           console.log('k')
  //         } else {
  //           console.error('Request to access the orientation was rejected');
  //         }
  //       })
  //       .catch(console.error);
  //   } else {
  //     // Handle regular non iOS 13+ devices.
  //     console.log('pas')
  //     window.addEventListener('deviceorientation', handleOrientation);
  //   }
  // }
  // function handleOrientation(event) {
  //   const a = event.alpha;
  //   const b = event.beta;
  //   const g = event.gamma;
  //   setAlpha(Math.round(a))
  //   setBeta(Math.round(b))
  //   setGamma(Math.round(g))
  // }
  // useEffect(() => {
  //   if(gamma <= 45 && gamma >= -45 && (beta > 170 || beta < -170)) {
  //     chooseimage()
  //   }
    
  // }, [beta, gamma])

  useEffect(() => {
    // console.log('qncomplete cjhanged', qnComplete)
    if(!qnComplete && isowner === 'yes') {
        // console.log('timer start')
        
        setSecondsLeft(secondsLeft = 20)
        setIntervalid(0)
        let temp = setInterval(() => {
          // console.log(playerlist)
          // setSecondsLeft(secondsLeft = 20)
          setIntervalid(intervalid = temp)
          // console.log(typeof(temp), temp, intervalid)
          

          if(secondsLeft > 0) {
            
            let temp = secondsLeft
            temp -= 1
            
            setSecondsLeft(secondsLeft = temp)
            
          } else {
            // console.log('fail')
            
            setNumComplete(numComplete = playernum)
            
            ws.current.send(JSON.stringify({
              msgType: 'timeout',
              roomId: roomId,
            }))
            let temp = questionsCompleted + 1
            setQuestionsCompleted(temp)
            
            ws.current.send(JSON.stringify({
              msgType: 'qndone',
              roomId: roomId,
              numComplete: numComplete,
            }))
          setSecondsLeft(secondsLeft = 20)
          // console.log(numComplete, 'aaa')
          }
          
        }, 1000)

        // console.log(temp.toString())

      
    }
  }, [qnComplete])


  useEffect(() => {
    let temp = [...plrScores]
    for(let i  = 0; i < playerlist.length; i++) {
      
      temp.push({name: playerlist[i], score: 0})

    }
    setPlrScores(plrScores = temp)
    console.log(plrScores, temp, playerlist)
  }, [])

  function chooseimage() {
    // setNumComplete(0)
    setOptions([])
    let folder = require.context('./images', true)
    let imageList = folder.keys().map(image => folder(image));
    
    let animalNames = ['cat','chicken','cow','crocodile','dog','duck','elephant','giraffe','horse','lion','pig','shark','sheep','snake','tiger']
    let animalNames2 = ['cat','chicken','cow','crocodile','dog','duck','elephant','giraffe','horse','lion','pig','shark','sheep','snake','tiger']
    
    let qnoptions = [...options]
    while (qnoptions.length < 3) {
      let randomn = Math.floor(Math.random() * animalNames2.length)
      let totalclear = 0
      for(let i = 0; i < qnoptions.length; i++) {
        if(qnoptions[i].name !== animalNames2[randomn]) {
          totalclear += 1
        }
      }
      if(totalclear >= qnoptions.length) {
        qnoptions.push({name: animalNames2[randomn], correct: false, index: randomn})
        // console.log(qnoptions, animalNames2[randomn])  
      }


    }

    if(qnoptions.length >= 3) {
      let randomcorrect = Math.floor(Math.random() * qnoptions.length)
      qnoptions[randomcorrect].correct = true
      let chosen = imageList[qnoptions[randomcorrect].index]
      // console.log(qnoptions)

      setChosenImage(chosen)
      setOptions(qnoptions)

      ws.current.send(JSON.stringify({
        msgType: 'questiondata',
        roomId: roomId,
        options: qnoptions,
        img: chosen
      })) 
      // ws.current.send(JSON.stringify({
        
      // }))

    }
  }

  

  useEffect(() => {
    ws.current = new WebSocket('wss://animalguessingws.onrender.com')

    

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if(data.roomId === roomId) {
        if(data.msgType === 'qndone') {
          setNumComplete(numComplete = (data.numComplete * 1))
          // console.log('add')
          // console.log('thats 1')
          if(data.numComplete === playernum) {
            
            setQnComplete(false)
            setSecondsLeft(secondsLeft = 20)
            setNumComplete(numComplete = 0)
            let temp = questionsCompleted + 1
            setQuestionsCompleted(questionsCompleted = temp)
            
            if(isowner === 'yes' && questionsCompleted < 10) {
              chooseimage() 
                        
            } else if(questionsCompleted >= 10) {
              clearInterval(intervalid)
              setFinished(true)
              console.log('finished', finished)
              if(isowner === 'no') {
                
                ws.current.send(JSON.stringify({
                  roomId: roomId,
                  msgType: 'scores',
                  score: score,
                  name: username
                }))
              }
              
            }
  
          }
          // console.log(data.numComplete, numComplete)
        } else if(data.msgType === 'questiondata') {
          console.log(data)
          if(isowner === 'no') {
            setChosenImage(data.img)
            setOptions(data.options)
          }
        } else if (data.msgType === 'timeout' && isowner === 'no') {
          setNumComplete(numComplete = 0)
          
            ws.current.send(JSON.stringify({
              msgType: 'qndone',
              roomId: roomId,
              numComplete: numComplete,
            }))
          
          
          setQnComplete(true)
          let temp = questionsCompleted + 1
          setQuestionsCompleted(temp)
          
          
        
          // chooseimage()
          setQnComplete(false)
        } else if(data.msgType === 'scores') {
          // // let temp = [...plrScores]
          // // temp.push({name: data.name, score: data.score})
          // setPlrScores(plrScores = [...plrScores, {name: data.name, score: data.score}])
          // console.log(plrScores, data)
        } else if(data.msgType === 'qncorrect') {
          if(data.username === username) {
            setScore(score += 1)
          }
          console.log('recieved')
          for(let i = 0; i < plrScores.length; i++) {
            console.log(plrScores[i].name, data.username)
            if(plrScores[i].name === data.username) {
              plrScores[i].score += 1
            }
            
          }
        }
      }
    }

    
      
      ws.current.onopen = (e) => {
        if(isowner === 'yes') {
          chooseimage() 
          
          // ws.current.send(JSON.stringify({
          //   msgType: 'questiondata',
          //   roomId: roomId,
          //   options: options,
          //   img: chosenImage
          // })) 
          
             
        } 
      }

      
         
    
  }, [])

  useEffect(() => {


  }, [])
  

  return (
    <div className="App">
      {/* <button onClick={handleClick}>enable</button>
      <br/>
      <br/> */}
      {/* <h2>alpha: {Math.round(alpha)}</h2>
      <h2>beta: {Math.round(beta)}</h2>
      <h2>gamma: {Math.round(gamma)}</h2> */}
      {/* {} */}
      {/* {beta < 3 && beta >= -1 && gamma < 3 && gamma >= -1 && <h1>lying down</h1>}
      {beta < 95 && beta > 80 && <h1>upright</h1>} */}
      {/* {((beta <= 20 && beta >= -20) || (beta >= 160 && beta <= -160)) && ((gamma <= -60 && gamma >= -90) || (gamma <= 90 && gamma >= 60)) && <img className='randImg' src={chosenImage} alt='tilt phone down to pick an image'/>}
      {gamma <= 45 && gamma >= -45 && (beta > 170 || beta < -170) && <div>
        
        <h1>picking animals</h1>
      </div>} */}
      <h2 className='score'>score: {score}</h2>
      {!qnComplete && !finished && isowner === 'yes' && <h2 className=''>time left: {secondsLeft}</h2>}
      {!finished && <div>
        {/* <h1>{isowner}</h1> */}
        {isowner === 'yes' && <img className='randImg' src={chosenImage} alt='img of stuff'/>}
        {isowner !== 'yes' && <div>
          {options.map((item) => (
            <div>
              <button onClick={(e) => {
                clearInterval(intervalid)
                if(item.correct) {
                  
                  setQnComplete(true)
                  ws.current.send(JSON.stringify({
                    msgType: 'qncorrect',
                    roomId: roomId,
                    username: username
                  }))
                }
                // setNumComplete(numComplete + 1)
                setQnComplete(true)
                // setQuestionsCompleted(questionsCompleted + 1)
                // console.log(numComplete)
                ws.current.send(JSON.stringify({
                  msgType: 'qndone',
                  roomId: roomId,
                  numComplete: numComplete + 1,
                }))
                
              }}>{item.name} {item.correct.toString()}</button>
            </div>
          ))}
        </div>}
      </div>}
        {qnComplete || isowner === 'yes' && <div>
            <h1>waiting for others to finish</h1>
            <h2>{numComplete}/{playernum}</h2>
        </div>}
        {finished && isowner === 'no' && <div>
          <h1>completed</h1>
          <h1>score: {score}</h1>
          <h1>you got {(score / 10) * 100}% of questions correct</h1>
        </div>}
        {console.log(plrScores)}
        {finished && isowner === 'yes' && plrScores.length > 0 && <div>
          <ol>
            {plrScores.map((plr) => (
              <li>
                {/* <h1>dsbnfjksnd</h1> */}
                {plr.name}: {plr.score}

              </li>
            ))}
          </ol>
        </div>}
    </div>
  );
}

export default Guessing;
