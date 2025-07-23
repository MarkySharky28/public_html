let angle = 0;
let brightness = 0;

function onframe(){
    console.log("hello world")

    angle+=50
    let angle2 = angle + 180
    let brightness = Math.random() < 0.5 ? 0 : 50;
    let style = "background-color:hsl(" + angle + ",100%," + brightness + "%);--rotation:" + angle2 + "deg"
    console.log(style)

    //document.body.style = "background-color:hsl" + angle + ",100%, 50%);--rotation:" + angle2 + "deg"


    document.body.style = style

    //requestAnimationFrame(onframe)
    setTimeout(onframe, 33.333333)
}

onframe()