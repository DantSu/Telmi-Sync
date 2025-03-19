import {convertImageToPng} from '../../BinFiles/FFmpegCommand.js'
import * as path from 'path'

const
  isImageFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.png' || ext === '.bmp' || ext === '.gif' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.avif'
  },
  convertMusicImage = async (fromPath, toPath, textToWrite, pageNumber) => {
    await convertImageToPng(fromPath, toPath, 256, 256, textToWrite, pageNumber)
  },
  convertCoverImage = async (fromPath, toPath, textToWrite, pageNumber) => {
    await convertImageToPng(fromPath, toPath, 512, 512, textToWrite, pageNumber)
  },
  convertStoryImage = async (fromPath, toPath, textToWrite, pageNumber) => {
    await convertImageToPng(fromPath, toPath, 640, 480, textToWrite, pageNumber)
  },
  convertInventoryImage = async (fromPath, toPath, textToWrite, pageNumber) => {
    await convertImageToPng(fromPath, toPath, 128, 128, textToWrite, pageNumber)
  },
  convertStoryImages = (srcImages, dstImages, textsToWrite, pagesNumbering, index, length, onEnd) => {
    if (!srcImages.length) {
      onEnd(index)
      return
    }

    const
      srcImage = srcImages.shift(),
      dstImage = dstImages.shift(),
      textToWrite = Array.isArray(textsToWrite) ? textsToWrite.shift() : undefined,
      pageNumber = Array.isArray(pagesNumbering) ? pagesNumbering.shift() : undefined

    process.stdout.write('*converting-images*' + index + '*' + length + '*')

    convertStoryImage(srcImage, dstImage, textToWrite, pageNumber)
      .then(() => convertStoryImages(srcImages, dstImages, textsToWrite, pagesNumbering, index + 1, length, onEnd))
      .catch(() => convertStoryImages(srcImages, dstImages, textsToWrite, pagesNumbering, index + 1, length, onEnd))
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
