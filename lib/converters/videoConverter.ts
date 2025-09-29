import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ConversionOptions } from '../types';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  return ffmpeg;
}

export async function convertVideo(file: File, toFormat: string, options: ConversionOptions = {}): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  const outputName = `output.${toFormat}`;
  await ffmpeg.exec(['-i', 'input', outputName]);
  const data = await ffmpeg.readFile(outputName);
  return new Blob([data], { type: `video/${toFormat}` });
}

export async function convertAudio(file: File, toFormat: string, options: ConversionOptions = {}): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  const outputName = `output.${toFormat}`;
  await ffmpeg.exec(['-i', 'input', outputName]);
  const data = await ffmpeg.readFile(outputName);
  return new Blob([data], { type: `audio/${toFormat}` });
}

export async function videoToAudio(file: File, format: string = 'mp3'): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  const outputName = `output.${format}`;
  await ffmpeg.exec(['-i', 'input', '-vn', '-acodec', 'libmp3lame', outputName]);
  const data = await ffmpeg.readFile(outputName);
  return new Blob([data], { type: `audio/${format}` });
}

export async function videoToGIF(file: File): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  await ffmpeg.exec(['-i', 'input', '-vf', 'fps=10,scale=320:-1:flags=lanczos', '-c:v', 'gif', 'output.gif']);
  const data = await ffmpeg.readFile('output.gif');
  return new Blob([data], { type: 'image/gif' });
}

export async function trimVideo(file: File, startTime: number, endTime: number): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  await ffmpeg.exec(['-i', 'input', '-ss', startTime.toString(), '-to', endTime.toString(), '-c', 'copy', 'output.mp4']);
  const data = await ffmpeg.readFile('output.mp4');
  return new Blob([data], { type: 'video/mp4' });
}

export async function compressVideo(file: File, quality: number = 23): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  await ffmpeg.exec(['-i', 'input', '-c:v', 'libx264', '-crf', quality.toString(), 'output.mp4']);
  const data = await ffmpeg.readFile('output.mp4');
  return new Blob([data], { type: 'video/mp4' });
}

export async function videoToFrames(file: File, fps: number = 1): Promise<Blob[]> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  await ffmpeg.exec(['-i', 'input', '-vf', `fps=${fps}`, 'frame_%03d.png']);
  
  const frames: Blob[] = [];
  let frameNumber = 1;
  
  while (true) {
    try {
      const frameName = `frame_${frameNumber.toString().padStart(3, '0')}.png`;
      const data = await ffmpeg.readFile(frameName);
      frames.push(new Blob([data], { type: 'image/png' }));
      frameNumber++;
    } catch {
      break;
    }
  }
  
  return frames;
}

export async function trimAudio(file: File, startTime: number, endTime: number): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  await ffmpeg.writeFile('input', await fetchFile(file));
  await ffmpeg.exec(['-i', 'input', '-ss', startTime.toString(), '-to', endTime.toString(), '-c', 'copy', 'output.mp3']);
  const data = await ffmpeg.readFile('output.mp3');
  return new Blob([data], { type: 'audio/mp3' });
}

