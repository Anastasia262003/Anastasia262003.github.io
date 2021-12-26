function getRandomBool() //функция генератор случайных значений типа boolean
{
  if (Math.floor(Math.random() * 2) === 0) /* Метод Math.floor() - округление вниз. Округляет аргумент до ближайшего меньшего целого.
  Метод Math.random() возвращает псевдослучайное число с плавающей запятой из диапазона [0, 1), то есть, от 0 (включительно) до 1 (но не включая 1).*/
  {
    return true
  }
}

function Game(context, cellSize)
{
  this.state =
  [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]

  ]

  this.color = "#66A5AD"

  this.context = context
  this.cellSize = cellSize

  this.clicks = 0
}

Game.prototype.getNullCell = function() // функция получения пустой клетки
{
  for (let i = 0; i<4; i++)
  {
    for (let j=0; j<4; j++)
    {
      if(this.state[j][i] === 0)
      {
        return {x: i, y: j}
      }
    }
  }
}

Game.prototype.draw = function() //рисование плиток с цифрами
{
  for (let i = 0; i < 4; i++)
  {
    for (let j = 0; j < 4; j++)
    {
      if (this.state[i][j] > 0)
      {
        this.cellView
        (
          j * this.cellSize,
          i * this.cellSize
        )
        this.numView()
        this.context.fillText
        (
          this.state[i][j],
          j * this.cellSize + this.cellSize / 2,
          i * this.cellSize + this.cellSize / 2
        )
      }
    }
  }
}

Game.prototype.numView = function() //функция отображение цифр
{
  this.context.font = "bold " + (this.cellSize/3) + "px Monospace"
  this.context.textAlign = "center"
  this.context.textBaseline = "middle"
  this.context.fillStyle = "#003B46"
}

Game.prototype.cellView = function(x, y) //вид ячеек/плиток
{
  this.context.fillStyle = this.color
  this.context.fillRect
  (
    x + 1,
    y + 1,
    this.cellSize - 2,
    this.cellSize - 2
  )
}

Game.prototype.move = function(x, y) // функция определения возможных ходов для текущего состояния "поля"
{
  let nullCell = this.getNullCell()
  let canMoveVertical = (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y
  let canMoveHorizontal = (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x

  if (canMoveVertical || canMoveHorizontal)
  {
    this.state[nullCell.y][nullCell.x] = this.state[y][x]
    this.state[y][x] = 0
    this.clicks++
  }
}

Game.prototype.mix = function(count)
{
  let x, y
  for (let i = 0; i < count; i++)
  {
    let nullCell = this.getNullCell()

    let verticalMove = getRandomBool()
    let upLeft = getRandomBool()

    if (verticalMove)
    {
      x = nullCell.x
      if (upLeft)
      {
        y = nullCell.y - 1
      }
      else
      {
        y = nullCell.y + 1
      }
    } else
    {
      y = nullCell.y
      if (upLeft)
      {
        x = nullCell.x - 1
      } else
      {
        x = nullCell.x + 1
      }
    }

    if (0 <= x && x <= 3 && 0 <= y && y <= 3)
    {
      this.move(x, y)
    }
  }
  this.clicks = 0
}

Game.prototype.getClicks = function()
{
  return this.clicks
}

Game.prototype.victory = function() // функция проверки состояния "поля" для последующего выхода при заданной комбинации
{
  let combination =
  [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
  ]
  let res = true
  for (let i = 0; i < 4; i++)
  {
    for (let j = 0; j < 4; j++)
    {
      if (combination[i][j] != this.state[i][j])
      {
        res = false
        break
      }
    }
  }
  return res
}

window.onload = function() // отрисовка холста canvas
{
  let canvas = document.getElementById("canvas")
  canvas.width  = 404
  canvas.height = 404

  let context = canvas.getContext("2d")
  context.fillRect(0, 0, canvas.width, canvas.height)

  let cellSize = canvas.width / 4

  let game = new Game(context, cellSize)
  game.mix(300)
  game.draw()

  canvas.onclick = function(f)
  {
    let x = (f.pageX - canvas.offsetLeft) / cellSize | 0
    let y = (f.pageY - canvas.offsetTop)  / cellSize | 0
    onEvent(x, y)
  }

  canvas.ontouchend = function(f)
  {
    let x = (f.touches[0].pageX - canvas.offsetLeft) / cellSize | 0
    let y = (f.touches[0].pageY - canvas.offsetTop)  / cellSize | 0

    onEvent(x, y)
  }

  function onEvent(x, y)
  {
    game.move(x, y)
    context.fillRect(0, 0, canvas.width, canvas.height)
    game.draw()
    if (game.victory())
    {
      alert("Завершено за "+game.getClicks()+" действий!")
      game.mix(300)
      context.fillRect(0, 0, canvas.width, canvas.height)
      game.draw(context, cellSize)
    }
  }
}