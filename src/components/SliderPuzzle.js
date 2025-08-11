import { useState } from 'react';
import "./SliderPuzzle.css"

const SliderPuzzle = () => {

  const [boardSize, setBoardSize] = useState(3);  //defaults to 3
  const [count, setCount] = useState(0);
  const startingSquares = initialSetup(boardSize);
  const [playerSquares, setPlayerSquares] = useState(startingSquares);
  //const [botSquares, setBotSquares] = useState(startingSquares);
  const [history, setHistory] = useState([ [ startingSquares ], [ null ] ]);
  const[status, setStatus] = useState(null);
  const[highScore, setHighScore] = useState(0);
 // const[frontier, setFrontier] = useState([[startingSquares, count, null]]);
 // const[exploredNodes, setExploredNodes] = useState( [ [startingSquares, 0/*score -- count + manhattanSquares*/, null] ] );
  const clickSound = new Audio('../click.ogg');

  function Square({ value, onSquareClick }) {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }

  //console.log("history", history);
  //console.log("frontier", frontier);
  console.log("count", count);
  //console.log("exlporeNodes", exploredNodes);

  const Overlay = ({ highScore, currentScore }) => {
    return (
        <div style={overlayStyle}>
            <h2>You Win!</h2>
            <p>High Score: {highScore}</p>
            <p>Your Score: {currentScore}</p>
        </div>
    );
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  function Board() {

    let boardSize = Math.sqrt(playerSquares.length);

    function handleClick(i) {
      
      //if the player clicks after winning or on an unmovable tile nothing happens
      if (calculateWinner(playerSquares) || !isMovable(i, playerSquares)){ return; }  //play an error noise
    
      clickSound.play();

      setCount(count + 1);
      const currentScore = count + 1;
      
      //let nextBotSquares = botMakesMove();
      //setBotSquares(nextBotSquares);      

      let nextPlayerSquares = playerSquares.slice();
      nextPlayerSquares[freeSquare(playerSquares)] = playerSquares[i];
      nextPlayerSquares[i] = null;
      setPlayerSquares(nextPlayerSquares);

      history[0].push(nextPlayerSquares);
      history[1].push([null]);
      setHistory([[...history[0]], [...history[1]]]);

      if(calculateWinner(nextPlayerSquares)){ 
        if (highScore == 0){ setHighScore(currentScore) }
        else if(currentScore < highScore) { setHighScore(currentScore) }
      }

      return;

    }

    /*function botMakesMove(){

     // console.log("exploredNodes", exploredNodes)
      //let frontier = [exploredNodes[0].slice()];

     // console.log("frontier at move start", frontier);

     // let explored = exploredNodes.slice();
   //   let destination = [];

      // explore every node for x layers and pick the best
      // node based on manhattanSquares, then trace back that
      // node to the parent node at the level of the next move
      // then make the move

      //for(let i = 1; i <= 2; i++){
        //frontier = explore(frontier, explored, count + i);
      //}
    
      //console.log("frontier before sort", frontier);

//      frontier = sortByCost(frontier);
      //add the first element to the explored list
      
      //console.log("frontier after sort", frontier);

  //    destination = frontier[0];

    //  let nextNode = null;

      //console.log("botSquares", botSquares);
      //console.log("explored[0][0]", explored[0][0]);

      //console.log("destination", destination);
      //console.log("destination 1", destination[1]);

      for(let i = destination[1]; i > explored[0][1] + 1; i--){
        console.log("destination", destination);                                         
        nextNode = destination[2];  //gets the previous board to the desination     
        console.log("nextNode", nextNode); 
        destination = nextNode;     //and repeats til it's making only 1 move
      }

      exploredNodes.unshift(nextNode);

      return nextNode[0];
      old version -- randomly chooses tile to move
      let moveFound = false;
      let index = null;

      while(!moveFound){
        index = Math.floor(Math.random() * boardSize) //this seems like its probably wrong
        if(isMovable(index, botSquares)){
          let nextSquares = botSquares.slice();
          nextSquares[freeSquare(botSquares)] = botSquares[index];
          nextSquares[index] = null;
          setBotSquares(nextSquares);
          moveFound = true;
          return nextSquares;
        }
      }
      */
    
    const renderBoard = () => {
      
      const board = [];

      for (let i = 0; i < boardSize; i++){
        const row = [];
        for (let j = 0; j < boardSize; j++){
          const index = boardSize * i + j;
          row.push(
            <Square
              key={index}
              value={playerSquares[index]} 
              onSquareClick={() => handleClick(index)} 
            />
          );
        }
        board.push(
          <div key={i} className="board-row">{row}</div>
        );          
      }

      //if(isPlayer){
      for (let i = 0; i < boardSize; i++){
        const row = [];
        for (let j = 0; j < boardSize; j++){
          const index = boardSize * i + j;
          row.push(
            <Square
              key={index}
              value={playerSquares[index]} 
              onSquareClick={() => handleClick(index)} 
            />
          );
        }
        board.push(
          <div key={i} className="board-row">{row}</div>
        );          
        //}
      }
                //Version 2 stuff
      /*
      else{
        console.log("botSquares", botSquares);
        for (let i = 0; i < boardSize; i++){
          const row = [];
          for (let j = 0; j < boardSize; j++){
            const index = boardSize * i + j;
            row.push(
              <Square
                key={index}
                value={botSquares[index]} 
                onSquareClick={() => handleClick(index)} 
              />
            );
          }
          board.push(
            <div key={i} className="board-row">{row}</div>
          );          
        }
      }
      */
      
      return board;
    }
   
    return (<div className="slide-puzzle-board">{renderBoard()}
    {calculateWinner(playerSquares) && 
    <Overlay highScore={highScore} currentScore={count} />}
    </div>);
  }

  const handleSizeChange = (event) => {
    let newBoardSize = Number(event.target.value)
    if(newBoardSize > 10 || newBoardSize < 2){
      setStatus("Please choose a size between 2 and 10!");
    }
    else{
      restart();
      setBoardSize(newBoardSize);
      setStatus(null);
      let newSquares = initialSetup(newBoardSize);
      setPlayerSquares(newSquares);
     // setBotSquares(newSquares);
      setHistory([[newSquares],[null]]);
    }
  };
  
  function undo() {
    if(calculateWinner(playerSquares)){ setStatus(null); }
    if(history[0].length > 1){
      console.log("undo");
      const lastHistory = [[...history[0].slice(0, count)], [...history[1].slice(0, count)]];
      setHistory(lastHistory);
      setCount(count - 1);
      setPlayerSquares(lastHistory[0][count - 1]);
    //  setBotSquares(lastHistory[1][count - 1]);  
    } 
    else{setStatus("No moves to undo!");}   
  }
  
  function newShuffle(){
    console.log("shuffle");
    restart();
    shuffle(playerSquares);
    setPlayerSquares(playerSquares);
  //  setBotSquares(playerSquares);
    setHistory([[playerSquares], [playerSquares]]);
  }
  
  function restart(){
    console.log("restart");
    while( history[0].length > 1 ){ 
      history[0].pop(); history[1].pop(); } 
    setHistory([history[0], history[0] ]);
    setPlayerSquares(history[0][0]);
//    setBotSquares(history[1][0]);
    setCount(0);
    setStatus(null);
  }

  return(
    <div className='slider-puzzle'>
      <input className='input' type="number" defaultValue={boardSize} 
      onChange={handleSizeChange} min="2" max="10"/>

      <div className="status">{status}</div> 
      <div className="count">Moves: {count}</div>
      <div>
          <>{Board()}</>
      </div>
      <div>
        <button className="button" onClick={() => undo()}>{"Undo"}</button>
        <button className="button" onClick={() => restart()}>{"Restart"}</button>
      </div>
      <button className="button" onClick={() => newShuffle()}>{"Shuffle"}</button>
    </div>
  )
}

export default SliderPuzzle;

/*
function explore(frontier, exploredNodesCopy, stepCost){  //[nodes][nodes][int]

  let explored = exploredNodesCopy.slice();

  //using startingLength keeps it constant, frontier is added to within the loop
  let startingLength = frontier.length;
  for(let j = 0; j < startingLength; j++){ 

    let squaresToBeExplored = frontier[j][0].slice();
    //console.log("squaresToBeExplored", squaresToBeExplored);
    let movableSquares = findMovableSquares(squaresToBeExplored);

    for(let i = 0; i < movableSquares.length; i++){

      let nextSquares = squaresToBeExplored.slice();
      nextSquares[freeSquare(squaresToBeExplored)] = movableSquares[i];
      nextSquares[findValue(squaresToBeExplored, movableSquares[i])] = null;

      //special case for first move
      if(frontier[0][2] == null){
        console.log("this should only ever print once");
        frontier.push([nextSquares, stepCost + getManhattanDistances(nextSquares), frontier[j]]);
      } else if(!hasBeenExplored(nextSquares, explored)){
          console.log("this node has not been explored");
          frontier.push([nextSquares, stepCost + getManhattanDistances(nextSquares), frontier[j]]);
      }
        //else => it has been explored so we dont add it
    }

    explored.push(frontier[j]);

  }

  //unlike above loop we need the final index to be variable 
  //as we remove items or we will go out of bounds
  for(let k = 0; k < frontier.length; k++){
    if(frontier[k][1] < stepCost){
      frontier.splice(k, 1);
      k--;  //this accounts for the removal making sure to check the same index agian 
    }
  }

  console.log("frontier in explore loop", frontier);

  return frontier;

}

/////////need to redo sorting now that the whole score is already included in the node
function sortByCost(frontierCopy){

  //sort the frontier by prioritizing manhattan distances comnbined with count
  let scores = [];
  let manhattanDistances = null;
  let nodesToExplore = frontierCopy.slice();

  for(let i = 0; i < nodesToExplore.length; i++){ //scores them all
    manhattanDistances = getManhattanDistances(nodesToExplore[i][0]);
    scores.push(manhattanDistances); // + frontierCopy[i][1]
  }

  //console.log("scores before sort", scores)
////////////////////////this is where breakpoints come in handy

  for (let i = 0; i < scores.length; i++){ //sorts frontier based on scores

    if(scores[i] > scores[i + 1]){
      //swap the elements in the frontiers AND the corresponding scores
      let temp1 = scores[i];
      let temp2 = nodesToExplore[i];

  //  console.log("temp2", temp2);

    scores[i] = scores[i + 1];
    scores[i + 1] = temp1;

    //console.log(i);

    //console.log("frontierCopy[i]", nodesToExplore[i]);
    //console.log("frontierCopy[i+1]", nodesToExplore[i+1]);

    nodesToExplore[i] = nodesToExplore[i + 1];
    nodesToExplore[i + 1] = temp2;

      
//    console.log("frontierCopy[i]", nodesToExplore[i]);
  //  console.log("frontierCopy[i+1]", nodesToExplore[i+1]);
    
      //restarts the loop at 0 to start the check over again 
      //each time a change is made
      i = -1;
    }

  }

 // console.log("scores after sort", scores);
 // console.log("frontier copy inside sort function after sorting", nodesToExplore);

  return nodesToExplore;

}

///this works but i must not be using it right because it doesnt succesfully block repeats
function hasBeenExplored(squares, exploredNodes){

  for (let i = 0; i < exploredNodes.length; i++){

    console.log("squares", squares);
    console.log("exploredNodes[i][0].slice()", exploredNodes[i][0].slice());

    if(JSON.stringify(squares.slice()) === JSON.stringify(exploredNodes[i][0].slice())){
      return true;
    }
    return false;
  }

}

function getManhattanDistances(squares){

  //note: the square with value 1 is index 0 in "squares"
  let boardSize = Math.sqrt(squares.length);
  let manhattanDistances = [];

  for (let i = 0; i < squares.length; i++){
    let j = squares[i] - 1;
    if(squares[i] == null){
      j = squares.length - 1;
    }

    let startingRow = [Math.floor(i / boardSize)]
    let startingCol = [i % boardSize]
    let destinationRow = [Math.floor( j / boardSize)]
    let destinationCol = [ j % boardSize]

    let colDistance = Math.abs(destinationCol - startingCol);
    let rowDistance = Math.abs(destinationRow - startingRow);

    manhattanDistances.push(colDistance + rowDistance);

  }

 // console.log("manhattanDistances", manhattanDistances);
  let sum = manhattanDistances.reduce((accumulator, current) => accumulator + current);
 // console.log("sum", sum);

  return sum;

}*/

function freeSquare(squares){
  return findValue(squares, null);
}

function findValue(squares, value){
  
  //returns position in "squares" of the value
  //console.log("squares, value", squares, value)
  let position = null;
  for(let i = 0; i < squares.length; i++){
    if(squares[i] == value)
      position = i;
  }
  return position;
}

function initialSetup(boardSize){

  let values = [];
  for (let i = 1; i < boardSize ** 2; i++){   //populate 1 -> 1-n
    values.push(i)           
  }
  values.push(null);           //adds null instead of last number for free square
  shuffle(values);          
  return values;

}

function shuffle(values) {
  let currentIndex = values.length;
  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    let copy = values[currentIndex]
    values[currentIndex] = values[randomIndex];
    values[randomIndex] = copy;
  }

  if(!isSolvable(values)){shuffle(values);}

}

function isSolvable(values){

  //for odd numbered boardsizes the # of inversions in the
  //row major order must be even to be solvable
  //an inversion is any pair of tiles i and j where i > j 
  //but i appears before j when considering the board in row-major order

  //for even numbered boardsizes it is only solvable if and only if the 
  //number of inversions //plus// the row of the free square is odd.

  //values =  [2, 5, 4, 7, 1, 6, 3, null, 8] 
  //solvable board for debugging 10 inversions

  let inversions = 0
  let rowMajorOrder = []
  let rowOfFreeSquare = -1;
  let boardSize = Math.sqrt(values.length);

  //removes the null
  for(let i = 0; i < values.length; i++){
    if(values[i] !== null){
      rowMajorOrder.push(values[i]);
    }
    else{ 
      rowOfFreeSquare = Math.floor(i/ boardSize)
    }
  }

  //counts inversions
  for(let i = 0; i < rowMajorOrder.length; i++){
    for(let j = i + 1; j < rowMajorOrder.length; j++){
      if(rowMajorOrder[i] > rowMajorOrder[j]){
        inversions++;
      }
    }
  }

  //check if its even or not
  if (boardSize % 2 == 1 && inversions % 2 == 0){return true} 
  else if( boardSize % 2 == 0 && (inversions + rowOfFreeSquare) % 2 == 1){return true}
  else{return false}

}

function isMovable(position, squares){

  let movable = findMovableSquares(squares);
  for(let i = 0; i < movable.length ; i++){
    if (movable[i] == squares[position]) {
      return true;
    }
  }
  return false;
}

function findMovableSquares(squares){

  //setup table for movable square recognizing
  let table = []
  let boardSize = Math.sqrt(squares.length);

  for (let i = 0; i < boardSize; i++){
    let row = []
    for (let j = 0; j < boardSize; j++){
      row.push(squares[boardSize * i + j]);
    }
    table.push(row)
  }

  let i = freeSquare(squares);
  let column = i % boardSize; 
  let row = 0;
  
  while(i >= boardSize){
    row++;
    i = i - boardSize;
  }
  
  //checks if the index is out of bounds and if not it adds that value to the list
  let movableSquares = [];
  if(column + 1 != boardSize){movableSquares.push(table[row][column + 1])}
  if(column - 1 != -1){movableSquares.push(table[row][column - 1])}
  if(row + 1 != boardSize){movableSquares.push(table[row + 1][column])}
  if(row - 1 != -1){movableSquares.push(table[row - 1][column])}

  return movableSquares;

}

function calculateWinner(squares) {

  const winnerCheck = new Array(squares.length - 1).fill(-1);
  let squaresCopy = squares.slice(0);

  for (let i = 0; i < squares.length - 1; i++) {
    if(squaresCopy[i] == i + 1){
      squaresCopy[i] = -1
    }
  }

  for(let i = 0; i < squares.length - 1; i++){
    if (squaresCopy[i] !== winnerCheck[i]) return false;
  }
  return true;
}