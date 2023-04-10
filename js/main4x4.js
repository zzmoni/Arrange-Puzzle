let numBoxes = document.querySelectorAll('.numValue');
const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", ""]

function setUp() {
  fillGrid(numBoxes, nums);
  setId(numBoxes)

  state.content = getState(numBoxes);
  state.dimension = getDimension(state);

  setEmpty(numBoxes);
  setClickable(numBoxes);

  console.log("The state dimension", state.dimension)
}


const state = {}
state.content = nums;

const getState = (items) => {
  const content = [];
  items.forEach((item, i) => {
    content.push(item.innerText)
  });
  return content;
}


const getEmptyCell = () => {
  const emptyCellNumber = state.emptyCellIndex+1;
  const emptyCellRow = Math.ceil(emptyCellNumber/4);
  const emptyCellCol = 4 - (4 * emptyCellRow - emptyCellNumber);
  return [emptyCellRow-1, emptyCellCol-1]
}


const getDimension = (state) => {
  let j = 0;
  let arr = [];
  const {content} = state;
  for(let i = 0; i < 4; i++) {
    arr.push(content.slice(j, j+4));
    j+=4;
  }
  return arr;
}


const setEmpty = (items) => {
  items.forEach((item, i) => {
    if(!item.innerText) {
      state.emptyCellIndex = i;
      item.parentNode.setAttribute("class", "numBox empty");
      item.setAttribute("class", "numValue emptyValue");
    }
    return;
  })
}


const removeEmpty = (items) => {
  items.forEach((item) => {
    item.parentNode.setAttribute("class", "numBox");
    item.setAttribute("class", "numValue");
  })
}


const setClickable = (items) => {
  const [row, col] = getEmptyCell();

  let left, right, top, bottom = null;
  if(state.dimension[row][col-1]) left = state.dimension[row][col-1];
  if(state.dimension[row][col+1]) right = state.dimension[row][col+1];

  if(state.dimension[row-1] != undefined) top = state.dimension[row-1][col];
  if(state.dimension[row+1] != undefined) bottom = state.dimension[row+1][col];

  items.forEach(item => {
    if(item.innerText == top || item.innerText == bottom || item.innerText == right || item.innerText == left) {
      item.parentNode.setAttribute("class", "numBox clickableNum");
      item.setAttribute("class", "numValue clickableValue");
      item.addEventListener('click', clickThis);
    }
  })
}


const setId = (items) => {
  for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("id", `num${i}`)
  }
}

const isSolvable = (arr) => {
  let number_of_inv = 0;
  for(let i = 0; i < arr.length; i++) {
    for(let j = i + 1; j < arr.length; j++) {
      if((arr[i] && arr[j]) && arr[i] > arr[j]) number_of_inv++;
    }
  }
  return (number_of_inv % 3 == 0);
}


const fillGrid = (items, nums) => {
  let shuffled = shuffle(nums);

  while(!isSolvable(shuffled)) {
    shuffled = shuffle(nums);
  }

  items.forEach((item, i) => {
    item.innerText = shuffled[i];
  })
}


const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = 0; i < copy.length; i++) {
    let j = parseInt(Math.random()*copy.length);
    let temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

const isCorrect = (solution, content) => {
  if(JSON.stringify(solution) == JSON.stringify(content)) return true;
  return false;
}




let turns = 0;

function clickThis() {
  const emptyBox = document.getElementsByClassName("empty")[0];
  const clickableBox = document.getElementsByClassName("clickableNum");

  const allValues = document.getElementsByClassName("clickableValue");
  for (let i = 0; i < allValues.length; i++) {
    const boxValues = allValues[i];

    boxValues.onclick = function(e) {
      if (!e.currentTarget.classList.contains('clickableValue')) {
        console.log("not clickable");
        return;
      }

      const el = e.currentTarget;
      const newParent =  el.parentNode.class === "empty" ? clickableBox : emptyBox;

      const emptyChild = document.getElementsByClassName("emptyValue")[0];
      const newEmpParent =  document.getElementsByClassName("clickableNum")[i];

      el.parentNode.removeChild(el);
      newParent.appendChild(el);

      emptyChild.parentNode.removeChild(emptyChild);
      newEmpParent.appendChild(emptyChild);
      console.log("empty child and clickableNum child swapped");




      turns += 1;
      document.getElementById('turns').innerText = `Turns: ${turns}`




      // new state
      setId(document.querySelectorAll('.numValue'));
      state.content = getState(document.querySelectorAll('.numValue'));
      state.dimension = getDimension(state);

      removeEmpty(document.querySelectorAll('.numValue'));

      setEmpty(document.querySelectorAll('.numValue')) ;
      setClickable(document.querySelectorAll('.numValue'));
      console.log("new state");




      if(isCorrect(nums, state.content)) {
        alert("You won!");
      }
      return;
    }
  }
}