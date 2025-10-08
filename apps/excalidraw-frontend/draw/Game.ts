import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      width: number;
      height: number
    }
    |
    {
        type: "pencil";
        points:{x:number;y:number}[]
    }
     |
     {
        type: "move";
        shape: Shape;
        offsetX: number;
        offsetY:  number;
     }


    export class Game {
        private canvas: HTMLCanvasElement;
        private ctx : CanvasRenderingContext2D;
        private existingShapes: Shape[];
        private roomId: string;
        private clicked: boolean;
        private startX = 0;
        private startY = 0;
        private currentPath: {x:number,y:number}[]=[];
        private endX = 0;
        private endY = 0;
        private height = 0;
        private width = 0;
        private selectedTool: Tool = "circle";
        private currentMouseX: number = 0;
        private currentMouseY: number = 0;

        socket: WebSocket;

        constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d")!;
            this.existingShapes = [];
            this.roomId = roomId;
            this.socket = socket;
            this.clicked = false;
            this.init();
            this.initHandlers();
            this.initMouseHandler();
        }

        destroy(){
            this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
            this.canvas.removeEventListener("mouseup",this.mouseUpHandler);
            this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
        }

        setTool(tool: Tool){
            this.selectedTool = tool;
        };

        async init(){
            this.existingShapes = await getExistingShapes(this.roomId);
            console.log(this.existingShapes)
            this.redrawCanvas();
        };

        initHandlers(){
            this.socket.onmessage = (event) => {
              const message = JSON.parse(event.data);
              if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.redrawCanvas();
              }
            };
        };

        redrawCanvas(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "rgba(0,0,0)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.existingShapes.forEach((shape)=>this.drawShape(shape));
        }

        drawShape(shape:Shape){
            this.ctx.strokeStyle="white";
            
             
                if (shape.type === "rect") {
                  this.ctx.strokeStyle = "rgba(255,255,255)";
                  this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                } else if (shape.type === 'circle'){
                    this.ctx.beginPath();
                    this.ctx.ellipse(shape.centerX,shape.centerY,Math.abs(shape.width), Math.abs(shape.height),0,0,Math.PI*2);
                    this.ctx.stroke();
                    this.ctx.closePath();
                } else if(shape.type==='pencil'){
                      if (!shape.points || shape.points.length < 2) return;

                    this.ctx.beginPath();
                    for (let i = 1; i < shape.points.length; i++) {
                      this.ctx.moveTo(shape.points[i - 1].x, shape.points[i - 1].y);
                      this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                }else if(shape.type === 'move'){
                    const movedShape = this.getMovedShape(shape);
                    this.drawShape(movedShape);
                }
        };

        getMovedShape(moveShape: Shape & {type: 'move'}): Shape{
            const {shape, offsetX,offsetY} = moveShape;
            switch( shape.type){
                case "rect":
                    return{
                        ...shape,
                        x: shape.x + offsetX,
                        y: shape.y + offsetY,
                    };
                    case "circle":
                        return{
                            ...shape,
                            centerX: shape.centerX + offsetX,
                            centerY: shape.centerY + offsetY,
                        };
                    case "pencil":
                        return{
                            ...shape,
                            points: shape.points.map(point =>({
                                x: point.x + offsetX,
                                y: point.y + offsetY
                            })),
                        };
                        default:
                            return shape;
            }
        }


        mouseDownHandler = (e: MouseEvent) =>{
            this.clicked = true;
            const rect = this.canvas.getBoundingClientRect();
            this.startX = e.clientX - rect.left; 
            this.startY = e.clientY - rect.top;
            this.currentMouseX = this.startX;
            this.currentMouseY = this.startY

            if(this.selectedTool === 'pencil'){
                this.currentPath = [{x:e.offsetX,y:e.offsetY}];
            } else if(this.selectedTool === 'move'){
                const shapeToMove = [...this.existingShapes].reverse().find((shape)=>{
                    if (shape.type === 'rect'){
                        return(
                            this.startX >= shape.x &&
                            this.startX <= shape.x + shape.width &&
                            this.startY >= shape.y &&
                            this.startY <= shape.y + shape.height
                        );
                    } else if(shape.type === 'circle'){
                        return (
                            Math.hypot(this.startX - shape.centerX, this.startY - shape.centerY) <= shape.centerX
                        )
                    }
                })
            }
            
            
        }

        mouseUpHandler = (e: MouseEvent) =>{
            this.clicked = false;
            
            const selectedTool = this.selectedTool;
            let shape: Shape | null = null;
            
            if(selectedTool==='rect'){
                this.width = (e.clientX - this.startX);
                this.height = (e.clientY - this.startY);
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    height:this.height,
                    width: this.width,
                }
            } else if(selectedTool === 'circle'){
                 this.width = (e.clientX - this.startX) / 2;
                 this.height = (e.clientY - this.startY) / 2;
                shape = {
                    type: "circle",
                    centerX: this.startX + this.width,
                    centerY: this.startY + this.height,
                    width: this.width, 
                    height: this.height

                }

            } else if(selectedTool==="pencil"){

                shape = {
                    type:"pencil",
                    points: this.currentPath
                };
            }

            if (!shape){
                return;
            };

            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: this.roomId
            }));
        };

        mouseMoveHandler = (e: MouseEvent) =>{
            if (this.clicked) {
                this.redrawCanvas();
                this.ctx.strokeStyle = "rgba(255,255,255)";
                const selectedTool = this.selectedTool;
                if(selectedTool === 'rect'){
                  this.width = e.clientX - this.startX;
                  this.height = e.clientY - this.startY;
                  this.ctx.strokeRect(this.startX, this.startY, this.width, this.height);
              } else if(selectedTool==="circle"){
                this.width = (e.clientX - this.startX) / 2;
                this.height = (e.clientY - this.startY) / 2;
                const centerX = this.startX + this.width;
                const centerY = this.startY + this.height;
                this.ctx.beginPath();
                this.ctx.ellipse(centerX,centerY,Math.abs(this.width),Math.abs(this.height),0,0,Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
              } else if(selectedTool ==='pencil'){
                this.currentPath.push({x:e.offsetX,y:e.offsetY});
                this.ctx.beginPath();
                const points = this.currentPath;
                for (let i = 1; i< points.length; i++){
                    this.ctx.moveTo(points[i-1].x, points[i-1].y);
                    this.ctx.lineTo(points[i].x, points[i].y);
                }
                this.ctx.stroke();
                this.ctx.closePath();
              }
            };
        };

        initMouseHandler(){
            this.canvas.addEventListener("mousedown", this.mouseDownHandler);
            this.canvas.addEventListener("mouseup", this.mouseUpHandler);
            this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        }

    }
