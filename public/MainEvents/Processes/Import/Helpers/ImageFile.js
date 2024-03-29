import { convertImageToPng } from '../../BinFiles/FFmpegCommand.js'
import * as path from 'path'

const
  isImageFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.png' || ext === '.bmp' || ext === '.gif' || ext === '.jpg' || ext === '.jpeg'
  },
  convertMusicImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 256, 256)
  },
  convertStoryImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 640, 480)
  },
  convertStoryImages = (srcImages, dstImages, index, length, onEnd) => {
    if (!srcImages.length) {
      onEnd(index)
      return
    }

    const
      srcImage = srcImages.shift(),
      dstImage = dstImages.shift()

    process.stdout.write('*converting-images*' + index + '*' + length + '*')

    convertStoryImage(srcImage, dstImage)
      .then(() => convertStoryImages(srcImages, dstImages, index + 1, length, onEnd))
      .catch(() => convertStoryImages(srcImages, dstImages, index + 1, length, onEnd))
  }

export { convertStoryImage, convertMusicImage, isImageFile, convertStoryImages }
