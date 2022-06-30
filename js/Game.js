class Game {
  constructor() {
    this.reset = createButton("");
    this.resetTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.leaderTitle = createElement("h2");
  }

  createElements() {
    form.titleImg.position(50,50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("reset");
    this.resetTitle.class("resetText");
    this.reset.class("resetButton");
    this.resetTitle.position(width/2+200,40);
    this.reset.position(width/2+200,100);

    this.leaderTitle.html("ranking:");
    this.leaderTitle.class("resetText");
    this.leaderTitle.position(width/3-60,50);
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,100);
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,150);
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2-50,height-100);
    car2 = createSprite(width/2+50,height-100);
    car1.addImage("car1",car1Img);
    car2.addImage("car2",car2Img);
    car1.scale = 0.07;
    car2.scale = 0.07;
    cars = [car1,car2];
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    this.addSprites(coins,20,coinImg,0.1);
    this.addSprites(fuels,10,fuelImg,0.02);
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }

  play() {
    form.hide();
    this.createElements();
    this.resetButton();
    Player.getPlayerInfo();
    if(allPlayers !== undefined) {
      image(track,0,-height*5,width,height*6)
      this.showRanking();
      drawSprites()
      var index = 0;
      for(var plr in allPlayers) {
        index = index + 1;
        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;
        cars[index-1].position.x=x;
        cars[index-1].position.y=y-100;
        if(index === player.index) {
          camera.position.y = cars[index-1].position.y-420;
          this.addFuel(index);
          this.addCoin(index);
        }
      }
      this.playerControls();
    }
  }

  getState() {
   var gameStateRef = database.ref("gameState")
    gameStateRef.on("value",function (data){
      gameState = data.val();
    })
  }

  updateState(state) {
    database.ref("/").update({
      gameState:state
    })
  }

  playerControls() {
    if(keyIsDown(UP_ARROW)) {
      player.positionY+=10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)&& player.positionX > width/3-50) {
      player.positionX-=5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW)&& player.positionX < width/2+300) {
      player.positionX+=5;
      player.update();
    }
  }

  resetButton() {
    this.reset.mousePressed(()=>{
      database.ref("/").set({
        carsEnd:0,
        playerCount:0,
        gameState:0,
        Players:{}
      })
      location.reload();
    })
  }

  showRanking() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  addSprites(spriteGroup,number,spriteImg,scale,positions=[]){
    for(var i = 0; i < number; i++){
      var X,Y
      if(positions.length > 0){
        X = positions[i].x
        Y = positions[i].y
        spriteImg = positions[i].image
      }
      else{
        X = random(width/2+150,width/2-150);
        Y = random(-height * 4.5,height - 400);
      }
      var sprite = createSprite(X,Y);
      sprite.addImage("sprite",spriteImg);
      sprite.scale = scale;
      spriteGroup.add(sprite)
      
    }
  }
  
  addFuel(index) {
    cars[index-1].overlap(fuels,function(coletor,coletavel){
      player.fuel = 200;
      coletavel.remove();
    }
    )
  }

  addCoin(index) {
    cars[index-1].overlap(coins,function(coletor,coletavel){
      player.score += 10;
      coletavel.remove();
      player.update();
    }
    )
  }
}
