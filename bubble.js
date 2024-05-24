const { Bodies, Body, Composite, Engine, Events, Render, Runner, Sleeping } = Matter;
const WIDTH = 800;
const HEIGHT = 1200;
const WALL_T = 10;
const DEADLINE = WALL_T;
const FRICTION = 0.3;
const MASS = 1;
const MAX_LEVEL = 11;
const WALL_COLOR = "#ccc";
const BUBBLE_IMAGES = [
  "daba.png",
  "feti.png",
  "dayo.png",
  "kyou.png",
  "berlin.png",
  "riroki.png",
  "mizuriro.png",
  "sayucha.png",
  "sayuki.png",
  "nyuno.png",
  "nyunoj.png",
];
const OBJECT_CATEGORIES = {
  WALL: 0x0001,
  BUBBLE: 0x0002,
  BUBBLE_PENDING: 0x0004,
};

// 効果音を再生するための関数
function playSound(src) {
  const sound = new Audio(src);
  sound.play();
}

// バブルが落下したときの効果音
const dropSound = './sounds/drop.mp3';

// バブルがくっついてサイズが変わるときの効果音
const mergeSound = './sounds/merge.mp3';

class BubbleGame {
  constructor(container, message, scoreChangeCallBack) {
    this.message = message;
    this.scoreChangeCallBack = scoreChangeCallBack;
    this.engine = Engine.create({ constraintIterations: 3 });
    this.cooldown = false; // クールタイムの初期化

    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        hasBounds: true,
      },
    });

    this.runner = Runner.create();
    Render.run(this.render);
    Runner.run(this.runner, this.engine);
    container.addEventListener("click", this.handleClick.bind(this));
    container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    container.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });
    container.addEventListener("touchend", this.handleTouchEnd.bind(this));
    Events.on(this.engine, "collisionStart", this.handleCollision.bind(this));
    Events.on(this.engine, "afterUpdate", this.checkGameOver.bind(this));
    this.pendingBubble = null;
    this.init();
  }

  init() {
    Composite.clear(this.engine.world);
    this.resetMessage();
    this.gameover = false;
    this.setScore(0);
    this.started = false;
    const ground = Bodies.rectangle(WIDTH / 2, HEIGHT - WALL_T / 2, WIDTH, WALL_T, {
      isStatic: true,
      render: { fillStyle: WALL_COLOR },
      collisionFilter: { category: OBJECT_CATEGORIES.WALL, mask: OBJECT_CATEGORIES.BUBBLE },
    });
    const leftWall = Bodies.rectangle(WALL_T / 2, HEIGHT / 2, WALL_T, HEIGHT, {
      isStatic: true,
      render: { fillStyle: WALL_COLOR },
      collisionFilter: { category: OBJECT_CATEGORIES.WALL, mask: OBJECT_CATEGORIES.BUBBLE },
    });
    const rightWall = Bodies.rectangle(WIDTH - WALL_T / 2, HEIGHT / 2, WALL_T, HEIGHT, {
      isStatic: true,
      render: { fillStyle: WALL_COLOR },
      collisionFilter: { category: OBJECT_CATEGORIES.WALL, mask: OBJECT_CATEGORIES.BUBBLE },
    });
    const ceiling = Bodies.rectangle(WIDTH / 2, WALL_T / 2, WIDTH, WALL_T, {
      isStatic: true,
      render: { fillStyle: WALL_COLOR },
      collisionFilter: { category: OBJECT_CATEGORIES.WALL, mask: OBJECT_CATEGORIES.BUBBLE },
    });

    Composite.add(this.engine.world, [ground, leftWall, rightWall, ceiling]);
  }

  start() {
    if (!this.started) {
      this.started = true;
      this.addBubble();
    }
  }

  addBubble() {
    const level = Math.floor(Math.random() * 4);
    const radius = (level + 1) * 20;
    const x = this.defaultX || WIDTH / 2;
    const y = 50;
    const bubble = Bodies.circle(x, y, radius, {
      label: "bubble_" + level,
      friction: FRICTION,
      mass: MASS,
      collisionFilter: { group: 0, category: OBJECT_CATEGORIES.BUBBLE, mask: OBJECT_CATEGORIES.WALL | OBJECT_CATEGORIES.BUBBLE },
      render: {
        sprite: {
          texture: `./images/${BUBBLE_IMAGES[level]}`,
          xScale: (radius * 2) / 100,
          yScale: (radius * 2) / 100,
        },
        lineWidth: 1,
      },
    });
    this.currentBubble = bubble;
    Composite.add(this.engine.world, bubble);
  }

  handleClick(e) {
    if (!this.currentBubble || this.gameover || this.cooldown) return; // クールタイムをチェック
    Body.setStatic(this.currentBubble, true);
    this.currentBubble = undefined;
    this.removePendingBubble();
    const x = e.offsetX || e.touches[0].pageX - e.target.offsetLeft;
    this.defaultX = x;
    this.cooldown = true; // クールタイムを設定
    setTimeout(() => {
      this.cooldown = false; // クールタイムを解除
      this.addBubble();
    }, 300); // 0.3秒のクールタイム
    playSound(dropSound); // バブルが落下したときの効果音を再生
  }

  handleCollision(event) {
    const pairs = event.pairs;
    pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (bodyA.label.startsWith("bubble_") && bodyB.label.startsWith("bubble_")) {
        const levelA = parseInt(bodyA.label.split("_")[1]);
        const levelB = parseInt(bodyB.label.split("_")[1]);
        if (levelA === levelB && levelA < MAX_LEVEL - 1) {
          const newLevel = levelA + 1;
          const newX = (bodyA.position.x + bodyB.position.x) / 2;
          const newY = (bodyA.position.y + bodyB.position.y) / 2;
          const newRadius = (newLevel + 1) * 20;
          const newBubbleImage = BUBBLE_IMAGES[newLevel];
          const newBubble = Bodies.circle(newX, newY, newRadius, {
            label: "bubble_" + newLevel,
            friction: FRICTION,
            mass: MASS,
            collisionFilter: { group: 0, category: OBJECT_CATEGORIES.BUBBLE, mask: OBJECT_CATEGORIES.WALL | OBJECT_CATEGORIES.BUBBLE },
            render: {
              sprite: {
                texture: `./images/${newBubbleImage}`,
                xScale: (newRadius * 2) / 100,
                yScale: (newRadius * 2) / 100,
              },
              lineWidth: 1,
            },
          });
          Composite.remove(this.engine.world, [bodyA, bodyB]);
          Composite.add(this.engine.world, [newBubble]);
          this.setScore(this.score + newLevel + 1);
          playSound(mergeSound); // バブルがくっついてサイズが変わるときの効果音を再生
        }
      }
    });
  }

  handleMouseMove(e) {
    if (!this.currentBubble || this.gameover || Body.isStatic(this.currentBubble)) return;
    this.removePendingBubble();
    const { offsetX } = e;
    const currentBubbleRadius = Number(this.currentBubble.label.substring(7)) * 20 + 10;
    const newX = Math.max(Math.min(offsetX, WIDTH - 10 - currentBubbleRadius), 10 + currentBubbleRadius);
    this.addPendingBubble(newX, 50); // Y座標を固定値(50)にする
    Body.setPosition(this.currentBubble, { x: newX, y: this.currentBubble.position.y });
    this.defaultX = newX;
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (!this.currentBubble || this.gameover || Body.isStatic(this.currentBubble)) return;
    this.removePendingBubble();
    const touch = e.touches[0];
    const { clientX } = touch;
    const currentBubbleRadius = Number(this.currentBubble.label.substring(7)) * 20 + 10;
    const newX = Math.max(Math.min(clientX - container.offsetLeft, WIDTH - 10 - currentBubbleRadius), 10 + currentBubbleRadius);
    this.addPendingBubble(newX, 50); // Y座標を固定値(50)にする
  }

  handleTouchEnd(e) {
    if (!this.currentBubble || this.gameover || this.cooldown) return; // クールタイムをチェック
    Body.setStatic(this.currentBubble, true);
    this.currentBubble = undefined;
    this.removePendingBubble();
    const x = e.changedTouches[0].pageX - e.target.offsetLeft;
    this.defaultX = x;
    this.cooldown = true; // クールタイムを設定
    setTimeout(() => {
      this.cooldown = false; // クールタイムを解除
      this.addBubble();
    }, 300); // 1秒のクールタイム
  }

  addPendingBubble(x, y) {
    const level = Math.floor(Math.random() * 4);
    const radius = (level + 1) * 20;
    const bubble = Bodies.circle(x, y, radius, {
      label: "pending_bubble",
      friction: FRICTION,
      mass: MASS,
      collisionFilter: { group: 0, category: OBJECT_CATEGORIES.BUBBLE_PENDING, mask: 0 },
      render: {
        sprite: {
          texture: `./images/${BUBBLE_IMAGES[level]}`,
          xScale: (radius * 2) / 100,
          yScale: (radius * 2) / 100,
        },
        lineWidth: 1,
        opacity: 0.5,
      },
    });
    this.pendingBubble = bubble;
    Composite.add(this.engine.world, bubble);
  }

  removePendingBubble() {
    if (this.pendingBubble) {
      Composite.remove(this.engine.world, this.pendingBubble);
      this.pendingBubble = null;
    }
  }

  checkGameOver() {
    if (this.gameover) return;
    const bubbles = Composite.allBodies(this.engine.world).filter(body => body.label.startsWith("bubble_"));
    if (bubbles.some(bubble => bubble.position.y <= DEADLINE)) {
      this.gameover = true;
      this.showMessage("Game Over");
    } else {
      const fallableBubbles = bubbles.filter(bubble => bubble.circleRadius <= 100);
      if (fallableBubbles.length > 0) {
        const randomIndex = Math.floor(Math.random() * fallableBubbles.length);
        const bubbleToFall = fallableBubbles[randomIndex];
        Body.setStatic(bubbleToFall, false);
      }
    }
  }

  showMessage(text) {
    this.message.innerHTML = `<p>${text}</p>`;
    this.message.style.display = "block";
  }

  resetMessage() {
    this.message.style.display = "none";
  }

  setScore(score) {
    this.score = score;
    if (this.scoreChangeCallBack) this.scoreChangeCallBack(score);
  }
}

window.onload = () => {
  const container = document.querySelector(".container");
  const message = document.querySelector(".message");
  const onChangeScore = (val) => {
    const score = document.querySelector(".score");
    score.innerHTML = `Score: ${val}`;
  };
  const game = new BubbleGame(container, message, onChangeScore);
  game.init();
  document.querySelector(".start-button").addEventListener("click", (e) => game.start(e));
  document.querySelector(".reset-button").addEventListener("click", (e) => game.init());
};
