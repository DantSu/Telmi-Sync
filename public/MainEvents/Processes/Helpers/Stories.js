import { stringNormalizeFileName, stringSlugify } from '../../Helpers/Strings.js'

const
  generateDirNameStory = (title, uuid, age, category) => {
    return stringNormalizeFileName(category || '').substring(0, 32) + '_' + ((age || '') + '').substring(0, 32) + '_' + stringNormalizeFileName(title).substring(0, 32) + '_' + stringSlugify(uuid).substring(0, 36)
  }

export { generateDirNameStory }
