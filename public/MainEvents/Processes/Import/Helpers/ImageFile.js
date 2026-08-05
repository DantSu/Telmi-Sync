import * as path from 'path'
import {convertImageToPng} from '../../BinFiles/FFmpegCommand.js'
import {findFile} from '../../../Helpers/Files.js'
import {runConcurrentPool} from '../../../Helpers/ConcurrencyPool.js'

const
  isImageFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.png' || ext === '.bmp' || ext === '.gif' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.avif'
  },
  findImage = (dir, fileName) => findFile(dir, fileName, ['.bmp', '.jpg', '.jpeg', '.gif', '.png', '.avif', '.webp']),
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
    const total = srcImages.length
    if (!total) {
      onEnd(index)
      return
    }

    runConcurrentPool(
      total,
      (i) => convertStoryImage(
        srcImages[i],
        dstImages[i],
        Array.isArray(textsToWrite) ? textsToWrite[i] : undefined,
        Array.isArray(pagesNumbering) ? pagesNumbering[i] : undefined
      ),
      (settledCount) => process.stdout.write('*converting-images*' + (index + settledCount) + '*' + length + '*')
    ).then(() => onEnd(index + total))
  },
  convertInventoryImages = (srcImages, dstImages, index, length, onEnd) => {
    const total = srcImages.length
    if (!total) {
      onEnd(index)
      return
    }

    runConcurrentPool(
      total,
      (i) => convertInventoryImage(srcImages[i], dstImages[i]),
      (settledCount) => process.stdout.write('*converting-images*' + (index + settledCount) + '*' + length + '*')
    ).then(() => onEnd(index + total))
  }

export {
  convertStoryImage,
  convertMusicImage,
  isImageFile,
  convertStoryImages,
  convertCoverImage,
  convertInventoryImage,
  convertInventoryImages,
  findImage
}
