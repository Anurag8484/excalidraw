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
            this.clearCanvas();
        };

        initHandlers(){
            this.socket.onmessage = (event) => {
              const message = JSON.parse(event.data);
              if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
              }
            };
        };

        clearCanvas(){
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.ctx.fillStyle = "rgba(0,0,0)";
              this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

              this.existingShapes.map((shape) => {
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
                }
              });
        };

        mouseDownHandler = (e: MouseEvent) =>{
            this.clicked = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            if(this.selectedTool === 'pencil'){
                this.currentPath = [{x:e.offsetX,y:e.offsetY}];
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
                this.clearCanvas();
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
              }
            };
        };

        initMouseHandler(){
            this.canvas.addEventListener("mousedown", this.mouseDownHandler);
            this.canvas.addEventListener("mouseup", this.mouseUpHandler);
            this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        }

    }
