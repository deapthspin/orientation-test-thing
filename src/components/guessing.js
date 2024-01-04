
import { useEffect, useRef, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Guessing(props) {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [chosenImage, setChosenImage] = useState('')
  // const [correctAns, setCorrectAns] = useState('')
  const [options, setOptions] = useState([])
  let [score, setScore] = useState(0)
  let [qnComplete, setQnComplete] = useState(false)
  let [questionsCompleted, setQuestionsCompleted] = useState(0)
  const [finished, setFinished] = useState(false)
  let [isVoting, setIsVoting] = useState(false)
  let [isShowingWin, setIsShowingWin] = useState(false)
  let [highestVotes, setHighestVotes] = useState({})

  let [numComplete, setNumComplete] = useState(0)
  let [intervalid, setIntervalid] = useState (0)
  const {question, setQuestion, chooseimage, playernum, roomId, isowner, playerlist, username, cards, setCards} = props
  let [secondsLeft, setSecondsLeft] = useState(0)
  let [plrScores, setPlrScores] = useState([])
  const [ans, setAns] = useState(['', ''])
  let [playerans, setPlayerans] = useState([])
  const [votedPlayer, setVotedPlayer] = useState('')
  // const [question, setQuestion] = useState('')
  let [playerVotes, setPlayerVotes] = useState([])
  let [cardschosen, setCardschosen] = useState([{}, {}])
  const navigate = useNavigate()
  const ws = useRef()

  // const handleClick = () => {
  //   if (typeof DeviceMotionEvent.requestPermission === 'function') {
  //     // Handle iOS 13+ devices.
  //     DeviceMotionEvent.requestPermission()
  //       .then((state) => {
  //         if (state === 'granted') {
  //           window.addEventListener('deviceorientation', handleOrientation);

  //         } else {
  //           console.error('Request to access the orientation was rejected');
  //         }
  //       })
  //       .catch(console.error);
  //   } else {
  //     // Handle regular non iOS 13+ devices.

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
    console.log(qnComplete)
    if(!qnComplete && isowner === 'yes') {
        console.log('yay')
        setSecondsLeft(secondsLeft = 20)
        setIntervalid(0)
        let temp = setInterval(() => {

          // setSecondsLeft(secondsLeft = 20)
          setIntervalid(intervalid = temp)

          

          if(secondsLeft > 0) {
            
            let temp = secondsLeft
            temp -= 1
            
            setSecondsLeft(secondsLeft = temp)
            
          } else {

            
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

          }
          
        }, 1000)



      
    }
  }, [qnComplete])


  useEffect(() => {
    let temp = [...plrScores]
    for(let i  = 0; i < playerlist.length; i++) {
      
      temp.push({name: playerlist[i], score: 0})

    }
    setPlrScores(plrScores = temp)
    setPlayerVotes(playerVotes = temp)
  }, [])

  // function chooseimage() {
  //   // setNumComplete(0)
      
  //   const questions = [
  //     'question 1',
  //     'question 2',
  //     'question 3',
  //     'question 4',
  //   ]
  //   let random = Math.floor(Math.random() * questions.length)
  //   setQuestion(questions[random])
    
  // }

  

  useEffect(() => {
    ws.current = new WebSocket('wss://animalguessingws.onrender.com')

    
    let cangetscore = true
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if(data.roomId === roomId) {
        if(data.msgType === 'qndone') {
          
            setNumComplete(numComplete += 1)


          if(numComplete >= playernum) {
            clearInterval(intervalid)
            setSecondsLeft(secondsLeft = 20)
            setNumComplete(numComplete = 0)
            if(isVoting) {
              let temp = questionsCompleted + 1
              
              setQuestionsCompleted(questionsCompleted = temp)
              

            }
            
            // cangetscore = true
            if(questionsCompleted < 3) {
               
              if(!isVoting) {
                setIsVoting(isVoting = true)
              } else {
                setIsVoting(isVoting = false)
                let num = 0
                let highest = {}
                console.log(playerVotes, playerlist, plrScores)
                playerVotes.map((item) => {
                  if(item.score >= num) {
                    num = item.score
                    highest = item
                    setHighestVotes(highestVotes = item)
                    
                  }
                })
                
                // console.log(highestVotes)
                plrScores.map((plr) => {
                  if(plr === highest) {
                    plr.score += 1
                  }
                })
                ws.current.send(JSON.stringify({
                  roomId: roomId,
                  msgType: 'upscore',
                  name: highest.name
                }))
                setIsShowingWin(isShowingWin = true)
                
                
                setTimeout(() => {
                  setIsShowingWin(isShowingWin = false)
                  
                  chooseimage()
                  console.log(qnComplete)
                  setQnComplete(qnComplete = false)
                  console.log(qnComplete)
                }, 2500)
              }
              
                        
            } else if(questionsCompleted >= 3) {
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
            setQnComplete(qnComplete = true)
            
          }

        } else if(data.msgType === 'questiondata') {

          if(isowner === 'no') {
            setChosenImage(data.img)
            setOptions(data.options)
          }
        } else if (data.msgType === 'timeout' && isowner === 'no') {
          setNumComplete(numComplete = 0)
          let tempnum1 = 0
          let tempnum2 = 0

          while(tempnum1 === tempnum2 && cards[tempnum1].colour !== 'white' && cards[tempnum2].colour !== 'black') {
            tempnum1 = Math.floor(Math.random() * cards.length)
            tempnum2 = Math.floor(Math.random() * cards.length)
          }
          setAns([`${cards[tempnum1]} `, `${cards[tempnum1]} `])
          sendAns()
            ws.current.send(JSON.stringify({
              msgType: 'qndone',
              roomId: roomId,
              numComplete: numComplete,
            }))
          
          
          setQnComplete(qnComplete = true)
          let temp = questionsCompleted + 1
          setQuestionsCompleted(temp)
          
          
        
          // chooseimage()
          setQnComplete(qnComplete = false)
        } else if(data.msgType === 'scores') {
          // // let temp = [...plrScores]
          // // temp.push({name: data.name, score: data.score})
          // setPlrScores(plrScores = [...plrScores, {name: data.name, score: data.score}])

        } else if(data.msgType === 'qncorrect') {
          
          if(data.username === username) {
            // setQnComplete(qnComplete = true)
            setScore(score += 1)
            // cangetscore = false
            
          }
          for(let i = 0; i < plrScores.length; i++) {

            if(plrScores[i].name === data.username) {
              plrScores[i].score += 1
            }
            
          }

          
        } else if(data.msgType === 'sendans') {
          let temp = [...playerans]
          temp.push({name: data.username, ans: data.ans})
          setPlayerans(playerans = temp)
          console.log(playerans)
        } else if(data.msgType === 'vote') {
          let tempvotes = [...playerVotes]
          tempvotes.map((item) => {
            if(item.name === data.voted.name) {
              item.score += 1
            }
          })
          setPlayerVotes(playerVotes = tempvotes)
          


        } else if(data.msgType === 'consolelog') {
          console.log(data.msg)
        } else if(data.msgType === 'upscore') {
          if(isowner !== 'yes') {
            ws.current.send(JSON.stringify({
              msgType: 'consolelog',
              roomId: roomId,
              msg: [username, data.name, data]
            }))
            if(username === data.name) {
              setScore(score += 1)
            }
          }
          
         } else if(data.msgType === 'kick') {
          console.log(data, 'kick msg')
          if(data.username === username) {
            navigate('/home')
            window.alert('you got disconnected')
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

  function addText(e, colour) {
    let temp = [...ans]
    if(!temp.includes(`${e.target.innerText} `)) {
      // console.log(temp, e.target.innerText)
      let temp2 = [...cardschosen]
      
      
      
      if(colour === 'white') {
        temp[0] = `${e.target.innerText} `
        temp2[0] = ({text: `${e.target.innerText}`, colour: colour})

      } else {
        temp[1] = `${e.target.innerText} `
        temp2[1] = ({text: `${e.target.innerText}`, colour: colour})
      }
      setCardschosen(cardschosen = temp2)
    } 
    
    setAns(temp)
  }

  function sendAns() {
    if(ans.length >= 2) {
      let temp = [...cards]
      let temp2 = [...ans].map((item) => item.trim())
      for(let i = 0; i < temp2.length; i++) {
        if(temp.findIndex((item) => item.text === temp2[i]) !== -1) {
          temp.splice(temp.findIndex((item) => item.text === temp2[i]), 1)
        }
        
      }
      setCards(temp)
      ws.current.send(JSON.stringify({
        msgType: 'sendans',
        ans: ans,
        roomId: roomId,
        username: username
      }))
      setAns(['', ''])
      setCardschosen([{}, {}])
      setPlayerans([])
      if(!qnComplete) {
        
        ws.current.send(JSON.stringify({
          msgType: 'qndone',
          roomId: roomId,
          numComplete: numComplete,
        }))
        setQnComplete(qnComplete = true)
        // if(item.correct) {
          
          
          // ws.current.send(JSON.stringify({
          //   msgType: 'qncorrect',
          //   roomId: roomId,
          //   username: username
          // }))
        // }
        // setQnComplete(qnComplete = true)
      }
      
      // setNumComplete(numComplete + 1)
      
      // setQuestionsCompleted(questionsCompleted + 1)
    }
  }


  useEffect(() => {


  }, [])
  


  function vote(e) {


    if(!qnComplete) {
      ws.current.send(JSON.stringify({
        msgType: 'qndone',
        roomId: roomId,
        numComplete: numComplete,
      }))
      setQnComplete(qnComplete = true)
    }
    ws.current.send(JSON.stringify({
      roomId: roomId,
      msgType: 'vote',
      voted: playerans[e.target.id]
    }))  
    


  }

  async function kick(e, username) {
    e.preventDefault()
    const res = await fetch(`https://animalguessingpg.onrender.com/rooms/${roomId}`)
    const data = await res.json()

    let tempplayerArr = [...data.players]
    
    tempplayerArr.splice(e.target.id, 1)

    await fetch(`https://animalguessingpg.onrender.com/roomplayers/${roomId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerArr: tempplayerArr
        })
    })

    ws.current.send(
        JSON.stringify({
            roomId: roomId,
            username: username,
            msgType: 'kick'
        })
    )
    
        
    
  }

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
      {/* <h2 className='score'>score: {score}</h2> */}
      {!qnComplete && !finished && !isVoting && isowner === 'yes' && <h2 className=''>time left: {secondsLeft}</h2>}
      {!finished && <div>
        {/* <h1>{isowner}</h1> */}
        {isowner === 'yes' && <div>
          <h1>{question}</h1>
        </div>}
        {/* <h1>{questionsCompleted}, {finished}</h1> */}
        {isVoting && <div>
          
          {playerans.map((plr, index) => (
            <div>
              <h1>{plr.name}: {plr.ans.join('')}</h1>
              {isVoting && isowner !== 'yes' && plr.name === votedPlayer.name && <h2>voted</h2>}
              {isVoting && isowner !== 'yes' && <button onClick={vote} id={index}>vote</button>}
              {isVoting && isowner === 'yes' && <button onClick={(e) => kick(e, plr.name)} id={index}>kick</button>}
            </div>
          ))}
        </div>}
        {isVoting && <h1>voting time</h1>}
        {isShowingWin && <div>
          <h1>highest votes: {highestVotes.name}</h1>
          {console.log(playerans, highestVotes, playerans.filter((plr) => plr.name === highestVotes.name.trim()))}
          <h2>{playerans.filter((plr) => plr.name === highestVotes.name.trim())['0'].ans.join('')}</h2>
        </div>}
        {isowner !== 'yes' && !qnComplete && <h1>{ans.join('')}</h1>}
        {isowner !== 'yes' && !isVoting && !isShowingWin && <div className='guessing-cards'>
            {cards.map((card) => (
              <div className={`card-${card.colour}`} onClick={(e) => addText(e, card.colour)}>
                  <h1>{card.text}</h1>
                  {/* <h1>{card.colour}</h1> */}
              </div>
            ))}
        </div>}
        {isowner === 'no' && !isVoting && <button onClick={sendAns}>send answer</button>}
        <br/>
        <br/>
        <br/>
        {isowner !== 'yes' && cardschosen.length && !isVoting && !isShowingWin && <div className='guessing-cards'>
            {console.log(cardschosen)}
            {cardschosen.map((card) => (
              <div className={`card-${card.colour}`}>
                  <h1>{card.text}</h1>
                  {/* <h1>{card.colour}</h1> */}
              </div>
            ))}
        </div>}
        
        {/* {isowner !== 'yes' && !qnComplete && <div>
          {options.map((item) => (
            <div>
              <button onClick={(e) => {
                clearInterval(intervalid)
                if(!qnComplete) {
                  setQnComplete(qnComplete = true)
                  ws.current.send(JSON.stringify({
                    msgType: 'qndone',
                    roomId: roomId,
                    numComplete: numComplete,
                  }))
                  if(item.correct) {
                    
                    
                    ws.current.send(JSON.stringify({
                      msgType: 'qncorrect',
                      roomId: roomId,
                      username: username
                    }))
                  }
                  // setQnComplete(qnComplete = true)
                }
                
                // setNumComplete(numComplete + 1)
                
                // setQuestionsCompleted(questionsCompleted + 1)

                
                
              }}>{item.name} {item.correct.toString()}</button>
            </div>
          ))}
        </div>} */}
      </div>}
        {qnComplete && !finished || isowner === 'yes' && <div>
            <h1>people who answered</h1>
            <h2>{numComplete}/{playernum}</h2>
        </div>}
        {finished && isowner === 'no' && <div>
          <h1>completed</h1>
          <h1>score: {score + 1}</h1>
          <h1></h1>
        </div>}

        {finished && isowner === 'yes' && plrScores.length > 0 && <div>
          {/* {console.log(plrScores.filter((plr) => plr.score === Math.max(plrScores.map((item) => item.score)))['0'])} */}
          <h1>the winner is: {plrScores.filter((plr) => plr.score === Math.max(plrScores.map((item) => item.score)))['0'].name}</h1>
          <ol>
            {plrScores.map((plr) => (
              <li>
                {/* <h1>dsbnfjksnd</h1> */}
                {plr.name}: {plr.score > 0 ? plr.score - 1 : plr.score}

              </li>
            ))}
          </ol>
        </div>}
    </div>
  );
}

export default Guessing;
