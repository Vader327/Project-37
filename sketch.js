var database, db_background;
var pos, pointSize;
var clear, slider, color_picker, bg_picker;
var slider_value, slider_value_min, slider_value_max;
var cp_text, bg_text;
var bg_color;

function setup(){
    createCanvas(1600,800);
    database = firebase.database().ref("Point/position");
    database.on("value",readPosition);

    db_background = firebase.database().ref("Background");
    db_background.on("value",readBackground);

    clear = createButton("Clear Canvas");
    clear.elt.id = "clear_button";
    clear.position(900, 850);

    slider = createSlider(5, 51, 5, 2);
    slider.elt.id = "slider";
    slider.position(400, 870);

    slider_value = createElement("h3");
    slider_value.elt.id = "values";
    slider_value.position(slider.x + 60 ,slider.y + 20);

    slider_value_min = createElement("h3");
    slider_value_min.elt.id = "values";
    slider_value_min.position(slider.x - 130,837);

    slider_value_max = createElement("h3");
    slider_value_max.elt.id = "values";
    slider_value_max.position(slider.x + 320,837);

    color_picker = createColorPicker('#000000');
    color_picker.elt.id = "color_picker"
    color_picker.position(1300,860);

    cp_text = createElement("h3");
    cp_text.elt.id = "values";
    cp_text.position(color_picker.x - 80 ,color_picker.y - 20);
    cp_text.html("Color:");

    bg_picker = createColorPicker(bg_color);
    bg_picker.elt.id = "color_picker"
    bg_picker.position(1700,860);

    bg_text = createElement("h3");
    bg_text.elt.id = "values";
    bg_text.position(bg_picker.x - 230 ,bg_picker.y - 20);
    bg_text.html("Background Color:");
}

function draw(){
    slider_value.html("Size: " + slider.value());
    slider_value_min.html(5);
    slider_value_max.html(51);

    clear.mousePressed(()=>{
        clearCanvas();
    })

    db_background.set(bg_picker.value());
}

function mouseDragged(){
    db_background.on("value",readBackground);

    pointSize = slider.value();
    stroke(color_picker.value());
    strokeWeight(pointSize);
    point(mouseX, mouseY);
    writePosition(mouseX, mouseY, pointSize, color_picker.value());
}

function readBackground(data){
    background(data.val());
    bg_color = data.val();
}

function readPosition(data){
    position = data.val();

    for(pos in position){
        stroke(position[pos].color);
        strokeWeight(position[pos].size);
        point(position[pos].x, position[pos].y);
    }

    if(position === null){
        clearCanvas();
    }
}

function writePosition(x,y,size,color){
    database.push({
        x : x,
        y : y,
        size : size,
        color : color
    })
}

function clearCanvas(){
    database.remove();
    var canvas = document.getElementById('defaultCanvas0')
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    db_background.on("value",readBackground);
}