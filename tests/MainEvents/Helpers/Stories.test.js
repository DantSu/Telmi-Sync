import {test} from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import {generateDirNameStory, readStories} from '../../../public/MainEvents/Helpers/Stories.js'

const
  createStoriesDir = (t) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'telmi-stories-'))
    t.after(() => fs.rmSync(root, {recursive: true, force: true}))
    const storiesPath = path.join(root, 'Stories')
    fs.mkdirSync(storiesPath)
    return storiesPath
  },

  createValidStory = (storiesPath, title, uuid) => {
    const md = {title, uuid, category: 'Conte', age: 0, image: 'title.png', version: 1}
    const dirName = generateDirNameStory(md.title, md.uuid, md.age, md.category)
    const dirPath = path.join(storiesPath, dirName)
    fs.mkdirSync(path.join(dirPath, 'audios'), {recursive: true})
    fs.mkdirSync(path.join(dirPath, 'images'))
    fs.writeFileSync(path.join(dirPath, 'nodes.json'), '{}')
    fs.writeFileSync(path.join(dirPath, 'metadata.json'), JSON.stringify(md))
    fs.writeFileSync(path.join(dirPath, 'title.mp3'), '')
    fs.writeFileSync(path.join(dirPath, 'title.png'), '')
    return dirName
  }

test('ignores macOS hidden files without error or deletion', (t) => {
  const storiesPath = createStoriesDir(t)
  const storyName = createValidStory(storiesPath, 'Conte moi', 'test-1')
  const hiddenFiles = [
    path.join(storiesPath, '._' + storyName),
    path.join(storiesPath, '.DS_Store'),
    path.join(storiesPath, '.Trashes', 'file'),
  ]
  for (const file of hiddenFiles) {
    fs.mkdirSync(path.dirname(file), {recursive: true})
    fs.writeFileSync(file, 'x')
  }

  const list = readStories(storiesPath)

  assert.deepEqual(list.error, [])
  assert.deepEqual(list.stories.map((s) => s.directory), [storyName])
  for (const file of hiddenFiles) {
    assert.ok(fs.existsSync(file), `${file} must not be deleted`)
  }
})

test('reports and removes an incomplete story', (t) => {
  const storiesPath = createStoriesDir(t)
  const brokenPath = path.join(storiesPath, 'Histoire_cassee')
  fs.mkdirSync(brokenPath)
  fs.writeFileSync(path.join(brokenPath, 'metadata.json'), '{}')

  const list = readStories(storiesPath)

  assert.deepEqual(list.error, ['Histoire_cassee'])
  assert.deepEqual(list.stories, [])
  assert.ok(!fs.existsSync(brokenPath))
})

test('reports without deleting a visible file that is not a story', (t) => {
  const storiesPath = createStoriesDir(t)
  const notePath = path.join(storiesPath, 'notes.txt')
  fs.writeFileSync(notePath, 'x')

  const list = readStories(storiesPath)

  assert.deepEqual(list.error, ['notes.txt'])
  assert.deepEqual(list.stories, [])
  assert.ok(fs.existsSync(notePath))
})
