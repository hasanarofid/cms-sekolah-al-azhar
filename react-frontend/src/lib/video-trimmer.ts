import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

let ffmpeg: FFmpeg | null = null
let ffmpegLoaded = false

/**
 * Load FFmpeg instance
 */
export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpegLoaded) {
    return ffmpeg
  }

  ffmpeg = new FFmpeg()
  
  // Load FFmpeg core from CDN (simple approach without toBlobURL)
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  
  try {
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    })
    
    ffmpegLoaded = true
    console.log('✅ FFmpeg.wasm loaded successfully!')
    return ffmpeg
  } catch (error) {
    console.error('❌ Failed to load FFmpeg.wasm:', error)
    throw new Error('Gagal memuat FFmpeg. Pastikan koneksi internet stabil.')
  }
}

/**
 * Trim video to specified duration (default 5 seconds)
 * @param file - Input video file
 * @param durationSeconds - Duration in seconds (default: 5)
 * @param onProgress - Progress callback (0-100)
 * @returns Trimmed video as Blob
 */
export async function trimVideo(
  file: File,
  durationSeconds: number = 5,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    const ffmpeg = await loadFFmpeg()
    
    // Progress callback
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.round(progress * 100))
      })
    }
    
    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const inputName = `input.${extension}`
    const outputName = `output.mp4`
    
    // Write input file to FFmpeg file system
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    
    // Trim video to specified duration
    // -i input: input file
    // -ss 0: start from beginning
    // -t duration: trim to specified seconds
    // -c:v libx264: encode with H.264
    // -preset ultrafast: fast encoding
    // -crf 23: quality (lower is better, 23 is default)
    // -c:a aac: encode audio with AAC
    // -b:a 128k: audio bitrate
    await ffmpeg.exec([
      '-i', inputName,
      '-ss', '0',
      '-t', durationSeconds.toString(),
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputName
    ])
    
    // Read output file
    const data = await ffmpeg.readFile(outputName)
    
    // Clean up
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
    
    // Convert to Blob (handle TypeScript type compatibility)
    const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' })
    return blob
  } catch (error) {
    console.error('Error trimming video:', error)
    throw new Error('Gagal memproses video. Pastikan video valid.')
  }
}

/**
 * Get video duration in seconds
 * @param file - Video file
 * @returns Duration in seconds
 */
export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(Math.round(video.duration))
    }
    
    video.onerror = () => {
      reject(new Error('Gagal membaca metadata video'))
    }
    
    video.src = URL.createObjectURL(file)
  })
}

/**
 * Check if video needs trimming
 * @param file - Video file
 * @param maxDuration - Maximum duration in seconds (default: 5)
 * @returns true if video is longer than maxDuration
 */
export async function shouldTrimVideo(file: File, maxDuration: number = 5): Promise<boolean> {
  try {
    const duration = await getVideoDuration(file)
    return duration > maxDuration
  } catch {
    return false
  }
}

/**
 * Compress video to reduce file size
 * @param file - Input video file
 * @param onProgress - Progress callback (0-100)
 * @returns Compressed video as Blob
 */
export async function compressVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    const ffmpeg = await loadFFmpeg()
    
    // Progress callback
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.round(progress * 100))
      })
    }
    
    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const inputName = `input.${extension}`
    const outputName = `output.mp4`
    
    // Write input file to FFmpeg file system
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    
    // Calculate bitrate based on target size and video duration
    // Formula: bitrate = (targetSize * 8192) / duration (in kbps)
    // We'll use a conservative CRF approach instead
    
    // Compress video with aggressive settings
    // -c:v libx264: H.264 codec
    // -crf 28: Higher CRF = more compression (0-51, 23 is default, 28 is more compressed)
    // -preset veryfast: Fast encoding
    // -vf scale: Reduce resolution if needed
    // -c:a aac: AAC audio
    // -b:a 64k: Low audio bitrate
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'veryfast',
      '-vf', 'scale=1280:720', // Reduce to 720p
      '-c:a', 'aac',
      '-b:a', '64k',
      '-movflags', '+faststart',
      outputName
    ])
    
    // Read output file
    const data = await ffmpeg.readFile(outputName)
    
    // Clean up
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)
    
    // Convert to Blob (handle TypeScript type compatibility)
    const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' })
    return blob
  } catch (error) {
    console.error('Error compressing video:', error)
    throw new Error('Gagal compress video. Pastikan video valid.')
  }
}

/**
 * Auto-compress video if file size exceeds limit
 * @param file - Input video file
 * @param maxSizeMB - Maximum allowed size in MB
 * @param onProgress - Progress callback (0-100)
 * @returns Compressed video or original if under limit
 */
export async function autoCompressIfNeeded(
  file: File,
  maxSizeMB: number = 5,
  onProgress?: (progress: number) => void
): Promise<File> {
  const fileSizeMB = file.size / (1024 * 1024)
  
  if (fileSizeMB <= maxSizeMB) {
    console.log(`✅ Video size OK: ${formatFileSize(file.size)} (limit: ${maxSizeMB}MB)`)
    return file
  }
  
  console.log(`⚠️ Video terlalu besar: ${formatFileSize(file.size)} (limit: ${maxSizeMB}MB)`)
  console.log(`🔄 Compressing video...`)
  
  const compressedBlob = await compressVideo(file, onProgress)
  const compressedFile = new File(
    [compressedBlob],
    file.name.replace(/\.[^/.]+$/, '') + '-compressed.mp4',
    { type: 'video/mp4' }
  )
  
  console.log(`✅ Video compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`)
  
  return compressedFile
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

