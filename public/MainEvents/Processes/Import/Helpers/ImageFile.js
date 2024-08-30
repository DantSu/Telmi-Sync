import {convertImageToPng} from '../../BinFiles/FFmpegCommand.js'
import * as path from 'path'

const
  isImageFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.png' || ext === '.bmp' || ext === '.gif' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp'
  },
  convertMusicImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 256, 256)
  },
  convertCoverImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 512, 512)
  },
  convertStoryImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 640, 480)
  },
  convertInventoryImage = async (fromPath, toPath) => {
    await convertImageToPng(fromPath, toPath, 128, 128)
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
  },
  convertInventoryImages = (srcImages, dstImages, index, length, onEnd) => {
    if (!srcImages.length) {
      onEnd(index)
      return
    }

    const
      srcImage = srcImages.shift(),
      dstImage = dstImages.shift()

    process.stdout.write('*converting-images*' + index + '*' + length + '*')

    convertInventoryImage(srcImage, dstImage)
      .then(() => convertInventoryImages(srcImages, dstImages, index + 1, length, onEnd))
      .catch(() => convertInventoryImages(srcImages, dstImages, index + 1, length, onEnd))
  }

export {
  convertStoryImage,
  convertMusicImage,
  isImageFile,
  convertStoryImages,
  convertCoverImage,
  convertInventoryImage,
  convertInventoryImages
}
