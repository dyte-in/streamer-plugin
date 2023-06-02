import { ToolData } from "./types";

export const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
};

export const colors = ['pink', 'red', 'orange', 'blue', 'yellow', 'black', 'white', 'grey', 'purple', 'peach', 'green', 'olive'];

export const tools: ToolData[] = [
    {icon: 'cursor', tool: 'drawing-tool-cursor'},
    {icon: 'draw', tool: 'drawing-tool-pencil'},
    {icon: 'highlight', tool: 'drawing-tool-highlight'},
    {icon: 'shape', tool: 'drawing-tool-shape'},
    {icon: 'text', tool: 'drawing-tool-text'},
    {icon: 'eraser', tool: 'drawing-tool-erase'},
    {icon: 'eraseAll', tool: 'drawing-tool-erase-all'},
    {icon: 'download', tool: 'export-tool'},
]

export const controller = new AbortController();
