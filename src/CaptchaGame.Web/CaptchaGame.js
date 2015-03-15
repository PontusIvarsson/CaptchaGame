/// <reference path="quintus-all.js" />
window.addEventListener('load', function (e) {

    var clamp = function (x, min, max) {
        return x < min ? min : (x > max ? max : x);
    }
    var clamping = function (x, min, max) {
        return x < min ? true : (x > max ? true : false);
    }

    var Q = Quintus()
        .include("Sprites, Anim, Input, Scenes, UI")
        .setup({ width: 600, height: 350 });

    Q.input.keyboardControls();

    Q.Sprite.extend("Player", {
        init: function (p) {
            this._super(p, {
                sprite: "player",
                sheet: "player",
                x: Q.el.width / 2,
                y: Q.el.height - 116,
                type: Q.SPRITE_FRIENDLY,
                speed: 1
            });
            var self = this;
            this.add("animation");
            this.play("default");
        },
        step: function (dt) {

            if (Q.inputs[''])
                this.play("default");

            if (Q.inputs['left']) {
                this.play("left");
                this.p.x -= 1 * this.p.speed;
            }
            if (Q.inputs['right']) {
                this.play("right");

                this.p.x += 1 * this.p.speed;
            }
            
            if (clamping(this.p.x, 0 + (this.p.w / 2), Q.el.width - (this.p.w / 2)))
            {
                Q.stageScene("endGame", 1, { label: "You are moving outside the box, obviously you are not a robot !" });
            }


            this.p.x = clamp(this.p.x, 0 + (this.p.w / 2), Q.el.width - (this.p.w / 2));
        }
    })

    Q.MovingSprite.extend("Ball", {
        draw: function (ctx) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(-this.p.cx,
                    -this.p.cy,
                    this.p.w / 2, 0, Math.PI * 2);
            ctx.fill();

        }
    });

    Q.scene("mainLevel", function (stage) {
        Q.gravity = 0;
        stage.insert(new Q.Sprite({ asset: "background.png", x: Q.el.width / 2, y: Q.el.height / 2, type: Q.SPRITE_NONE }));
        stage.insert(new Q.Player());
    });

    Q.scene("mainLevelBall", function (stage) {
        Q.gravity = 0;
        stage.insert(new Q.Sprite({ asset: "background.png", x: Q.el.width / 2, y: Q.el.height / 2, type: Q.SPRITE_NONE }));
        stage.insert(new Q.Player());

        var ball = new Q.Ball({
            w: 5, h: 20,
            x: 5, y: 10,
            vx: 100, vy: 100,
            ax: 10, ay: 50
        });


        stage.insert(ball);
    });

    Q.scene("endGame", function (stage) {
       
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2, y: Q.height / 2, fill: "#FFFFFF"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0, y: 0, fill: "#CCCCCC", label: "Iam sure, if you are not, please try again!"
        }));

        container.insert(new Q.UI.Text({
            h: 1, x:10, y: -10 - button.p.h, label: stage.options.label
        }));

        button.on("click", function () {
            Q.clearStages();
            Q.stageScene("mainLevel");
        });
    });

    Q.load(["background.png", "softrobot.png", "player.json"], function () {

        Q.compileSheets("softrobot.png", "player.json");
        Q.animations("player", {
            default: { frames: [0, 1, 2, 3], rate: 1 / 1 },
            right: { frames: [5, 6, 7, 8], rate: 1 / 6 },
            left: { frames: [10, 11, 12, 13], rate: 1 / 6 }
        });

        Q.stageScene("mainLevelBall");
        //Q.stageScene("endGame", 1, { label: "You are moving outside the box, obviously you are not a robot !" });
    });
});