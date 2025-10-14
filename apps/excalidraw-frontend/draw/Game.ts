import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
import { distanceFromPointToSegment } from "./Math";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      id?: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      width: number;
      height: number;
      id?: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
      id?: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private mouseX = 0;
  private mouseY = 0;
  private currentPath: { x: number; y: number }[] = [];
  private offSetX = 0;
  private offSetY = 0;
  private height = 0;
  private prevMouseX = 0;
  private prevMouseY = 0;
  // private scale = 0;
  private viewportTransform = { x: 0, y: 0, scale: 1 };
  private isPanning = false;
  private selectedTool: Tool = "panning";
  private selectedShape: Shape | null = null;
  private activeShape: Shape | null = null;

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
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

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    console.log("init rendered");
    this.existingShapes = await getExistingShapes(this.roomId);
    console.log(this.existingShapes);
    this.redrawCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "created") {
        const parsed = JSON.parse(message.message);
        this.existingShapes.push(parsed.shape);
        this.clearCanvas();
      } else if (message.type === "updated") {
        const parsed = JSON.parse(message.message);
        const idx = this.existingShapes.findIndex(
          (s) => s.id === parsed.shape.id
        );
        if (idx !== -1) this.existingShapes[idx] = parsed.shape;
        this.clearCanvas();
      } else if (message.type === "erased") {
        const parsed = JSON.parse(message.message);
        this.existingShapes = this.existingShapes.filter(
          (shape) => shape.id !== parsed.shape.id
        );
        this.clearCanvas();
      }
    };
  }

  isInside(shape: Shape, x: number, y: number): boolean {
    if (shape.type === "rect") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    } else if (shape.type === "circle") {
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      const rx = Math.abs(shape.width);
      const ry = Math.abs(shape.height);
      return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
    } else if (shape.type === "pencil") {
      console.log("inside pencil");
      if (!shape.points || shape.points.length < 2) {
        return false;
      }

      for (let i = 1; i < shape.points.length; i++) {
        const p1 = shape.points[i - 1];
        const p2 = shape.points[i];
        const dist = distanceFromPointToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
        // console.log(`distance ${dist}`);
        if (dist < 5) return true;
      }
      return false;
    }

    return false;
  }

  redrawCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(
      this.viewportTransform.scale,
      0,
      0,
      this.viewportTransform.scale,
      this.viewportTransform.x,
      this.viewportTransform.y
    );
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => this.drawShape(shape));
  }
  drawShape(shape: Shape) {
    this.ctx.strokeStyle = "white";
    if (shape.type === "rect") {
      this.ctx.strokeStyle = "rgba(255,255,255)";
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.ellipse(
        shape.centerX,
        shape.centerY,
        Math.abs(shape.width),
        Math.abs(shape.height),
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil") {
      if (!shape.points || shape.points.length < 2) return;
      this.ctx.beginPath();
      for (let i = 1; i < shape.points.length; i++) {
        this.ctx.moveTo(shape.points[i - 1].x, shape.points[i - 1].y);
        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  updatePanning = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const dx = screenX - this.prevMouseX;
    const dy = screenY - this.prevMouseY;

    this.viewportTransform.x += dx;
    this.viewportTransform.y += dy;

    this.prevMouseX = screenX;
    this.prevMouseY = screenY;
  };

  toWorldCoords(x: number, y: number) {
    return {
      x: (x - this.viewportTransform.x) / this.viewportTransform.scale,
      y: (y - this.viewportTransform.y) / this.viewportTransform.scale,
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0,1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.width),
          Math.abs(shape.height),
          0,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
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
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;

    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.toWorldCoords(screenX, screenY);

    this.mouseX = x;
    this.mouseY = y;
    this.prevMouseX = x;
    this.prevMouseY = y;

    const clickedShape = this.existingShapes.find((shape) =>
      this.isInside(shape, x, y)
    );

    if (this.selectedTool === "move") {
      if (clickedShape) {
        this.activeShape = clickedShape;
        if (clickedShape.type === "rect") {
          this.offSetX = x - clickedShape.x;
          this.offSetY = y - clickedShape.y;
        } else if (clickedShape.type === "circle") {
          this.offSetX = x - clickedShape.centerX;
          this.offSetY = y - clickedShape.centerY;
        } else if (
          clickedShape.type === "pencil" &&
          clickedShape.points.length
        ) {
          // console.log("pencil clicked");
          const first = clickedShape.points[0];
          this.offSetX = x - first.x;
          this.offSetY = y - first.y;
        }
      } else {
        this.activeShape = null;
      }
    }
    if (this.selectedTool === "eraser") {
      if (clickedShape) {
        this.existingShapes = this.existingShapes.filter(
          (shape) => shape !== clickedShape
        );
        this.socket.send(
          JSON.stringify({
            type: "erase",
            message: JSON.stringify({ shape: clickedShape }),
            roomId: this.roomId,
          })
        );
      }
    }

    if (this.selectedTool === "pencil") {
      this.currentPath = [{ x, y }];
    }

    if (this.selectedTool === "panning") {
      this.isPanning = true;
      const rect = this.canvas.getBoundingClientRect();
      this.prevMouseX = e.clientX - rect.left;
      this.prevMouseY = e.clientY - rect.top;
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.toWorldCoords(screenX, screenY);

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      const width = x - this.mouseX;
      const height = y - this.mouseY;
      shape = {
        type: "rect",
        x: this.mouseX,
        y: this.mouseY,
        height,
        width,
      };
    } else if (selectedTool === "circle") {
      const width = (x - this.mouseX) / 2;
      const height = (y - this.mouseY) / 2;
      shape = {
        type: "circle",
        centerX: this.mouseX + width,
        centerY: this.mouseY + height,
        width,
        height,
      };
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.currentPath,
      };
      this.currentPath = [];
    } else if (selectedTool === "move") {
      console.log("check 1");
      if (this.activeShape) {
        this.socket.send(
          JSON.stringify({
            type: "update",
            message: JSON.stringify({ shape: this.activeShape }),
            roomId: this.roomId,
          })
        );
      }
      this.activeShape = null;
      this.clearCanvas();
    } else if (selectedTool === "panning") {
      this.isPanning = false;
      return;
    }
    if (!shape) return;
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      })
    );
    // this.existingShapes.push(shape)
    this.clearCanvas();
    // this.init();
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.redrawCanvas();
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.toWorldCoords(screenX, screenY);

    const selectedTool = this.selectedTool;

    this.clearCanvas();
    this.ctx.strokeStyle = "rgba(255,255,255)";

    if (selectedTool === "rect") {
      const width = x - this.mouseX;
      const height = y - this.mouseY;
      this.ctx.strokeRect(this.mouseX, this.mouseY, width, height);
    } else if (selectedTool === "circle") {
      const width = (x - this.mouseX) / 2;
      const height = (y - this.mouseY) / 2;
      const centerX = this.mouseX + width;
      const centerY = this.mouseY + height;
      this.ctx.beginPath();
      this.ctx.ellipse(
        centerX,
        centerY,
        Math.abs(width),
        Math.abs(height),
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (selectedTool === "pencil") {
      this.currentPath.push({ x, y });
      this.ctx.beginPath();
      const points = this.currentPath;
      for (let i = 1; i < points.length; i++) {
        this.ctx.moveTo(points[i - 1].x, points[i - 1].y);
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.stroke();
    } else if (selectedTool === "move" && this.activeShape) {
      const shape = this.activeShape;

      if (shape.type === "rect") {
        shape.x = x - this.offSetX;
        shape.y = y - this.offSetY;
      } else if (shape.type === "circle") {
        shape.centerX = x - this.offSetX;
        shape.centerY = y - this.offSetY;
      } else if (shape.type === "pencil") {
        const dx = x - this.prevMouseX;
        const dy = y - this.prevMouseY;
        shape.points = shape.points.map((p) => ({
          x: p.x + dx,
          y: p.y + dy,
        }));
      }
      this.prevMouseX = x;
      this.prevMouseY = y;

      this.clearCanvas();
    } else if (selectedTool === "panning") {
      this.updatePanning(e);
      this.redrawCanvas();
      return;
    }
  };

  initMouseHandler() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
