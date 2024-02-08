import { downloadFile, requestJson } from '../../Helpers/Request.js'
import * as path from 'path'

const getMusicBrainzCoverImage = async (artist, album, dirPath) => {
  try {
    const
      requestVars = [...artist.split(/[ -]+/), ...album.split(/[ -]+/)]
        .filter((v, i, a) => v !== '' && a.indexOf(v) === i)
        .map((v) => '%22' + v + '%22')
        .join('%20AND%20'),
      albumData = await requestJson('https://musicbrainz.org/ws/2/release/?fmt=json&limit=5&query=' + requestVars)

    if (!albumData.releases.length) {
      return null
    }
    let coverData = null
    for (let i = 0; i < albumData.releases.length; i++) {
      try {
        const cd = await requestJson('https://coverartarchive.org/release/' + albumData.releases[i].id + '/')
        if (cd.images.length > 0) {
          coverData = cd
          break
        }
      } catch (ignored) {}
    }

    if (coverData === null) {
      return null
    }

    return await downloadFile(coverData.images[0].image, path.join(dirPath, path.basename(coverData.images[0].image)), () => {})
  } catch (e) {
    return null
  }
}
export { getMusicBrainzCoverImage }
