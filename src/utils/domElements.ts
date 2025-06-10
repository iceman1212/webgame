// DOM Elements - assert types and check for null where necessary
export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
export const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D | null;

export const scoreEl = document.getElementById("score") as HTMLElement | null;
export const livesEl = document.getElementById("lives") as HTMLElement | null;
export const questionEl = document.getElementById("questionText") as HTMLElement | null;

export const startBtn = document.getElementById("startBtn") as HTMLButtonElement | null;
export const overlay = document.getElementById("overlay") as HTMLElement | null;
export const messageTitle = document.getElementById("messageTitle") as HTMLElement | null;
export const messageContent = document.getElementById("messageContent") as HTMLElement | null;
export const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement | null;
