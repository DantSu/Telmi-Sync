import {useMemo} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'

import SVGLayout from '../../../../Components/SVG/SVGLayout.js'
import StudioStoryNodeAction from './StudioStoryNodeAction.js'
import StudioStoryLine from './StudioStoryLine.js'
import StudioStoryStage from './StudioStoryStage.js'
import StudioStoryStartStage from './StudioStoryStartStage.js'

const
  nodeWidth = 80,
  nodeHeight = 80,
  margin = 30,

  getNodesSizesRecursive = (nodes, aKey, stageParent, lvl, stagesSize, actionsSize) => {
    return nodes.actions[aKey].reduce(
      (acc, a, k) => {
        const actionKey = aKey + '-' + k

        if (actionsSize[actionKey] === undefined || stagesSize[a.stage].stageParent === stageParent) {
          actionsSize[actionKey] = {
            lvl: lvl,
            posX: stagesSize[stageParent].posX + acc
          }
        }

        if (a.stage === 'backStage' || stagesSize[a.stage].stageParent !== stageParent || stagesSize[a.stage].posX !== undefined) {
          return acc + nodeWidth
        }

        const stage = nodes.stages[a.stage]
        stagesSize[a.stage].lvl = lvl + 1
        stagesSize[a.stage].posX = actionsSize[actionKey].posX
        if (stage === undefined || stage.ok === null || !nodes.actions[stage.ok.action].length) {
          stagesSize[a.stage].width = nodeWidth
        } else {
          stagesSize[a.stage].width = getNodesSizesRecursive(nodes, stage.ok.action, a.stage, lvl + 2, stagesSize, actionsSize)
        }
        return acc + stagesSize[a.stage].width
      },
      0
    )
  },
  getNodesSizes = (nodes, aKey, stageFrom, defaultPoxX, stagesSize, actionsSize) => {
    const
      stagesDone = Object.keys(stagesSize).reduce((acc, stageKey) => ({...acc, [stageKey]: true}), {}),
      stages = nodes.actions[aKey].map((a) => {
        if (stagesSize[a.stage] === undefined) {
          stagesSize[a.stage] = {stageParent: stageFrom}
        }
        return a.stage
      })
    while (stages.length > 0) {
      const stageId = stages.shift()

      if (stagesDone[stageId]) {
        continue
      }

      const stage = nodes.stages[stageId]

      stagesDone[stageId] = true

      if (stage === undefined || stage.ok === null) {
        continue
      }

      nodes.actions[stage.ok.action].forEach((a) => {
        if (stagesSize[a.stage] === undefined) {
          stagesSize[a.stage] = {stageParent: stageId}
        }
        if (!stagesDone[a.stage]) {
          stages.push(a.stage)
        }
      })
    }

    stagesSize[stageFrom] = {lvl: 0, posX: defaultPoxX}
    stagesSize[stageFrom].width = getNodesSizesRecursive(nodes, aKey, stageFrom, 1, stagesSize, actionsSize) || nodeWidth

    return [stagesSize, actionsSize]
  },
  getNodes = (nodes) => {
    const
      startActionKey = nodes.startAction.action,
      backActionKey = nodes.stages.backStage.ok.action,
      [startStagesSize, startActionsSize] = getNodesSizes(nodes, startActionKey, 'startStage', 0, {}, {}),
      [stagesSize, actionsSize] = getNodesSizes(nodes, backActionKey, 'backStage', startStagesSize.startStage.width, startStagesSize, startActionsSize),
      stages = [
        ...nodes.actions[startActionKey].map((a, k) => ({
          stageId: a.stage,
          stageFrom: 'startStage',
          actionFrom: startActionKey + '-' + k
        })),
        ...nodes.actions[backActionKey].map((a, k) => ({
          stageId: a.stage,
          stageFrom: 'backStage',
          actionFrom: backActionKey + '-' + k
        }))
      ],
      stagesPos = {
        startStage: {
          x: margin + stagesSize.startStage.posX + stagesSize.startStage.width / 2,
          y: margin + (stagesSize.startStage.lvl + 0.5) * nodeHeight
        },
        backStage: {
          x: margin + stagesSize.backStage.posX + stagesSize.backStage.width / 2,
          y: margin + (stagesSize.backStage.lvl + 0.5) * nodeHeight
        }
      },
      actionsPos = {},
      firstActionParentDrawn = {},
      components = {
        stages: [
          <StudioStoryStartStage key={'stage-startStage'}
                                 x={stagesPos.startStage.x}
                                 y={stagesPos.startStage.y}/>,
          <StudioStoryStage key={'stage-backStage'}
                            stageId={'backStage'}
                            x={stagesPos.backStage.x}
                            y={stagesPos.backStage.y}/>
        ],
        actions: [],
        lines: []
      }

    while (stages.length > 0) {
      const
        {stageId, stageFrom, actionFrom} = stages.shift(),
        newStage = stagesPos[stageId] === undefined,
        stage = nodes.stages[stageId]

      if (newStage) {
        stagesPos[stageId] = {
          x: stagesSize[stageId].posX + stagesSize[stageId].width / 2 + margin,
          y: (stagesSize[stageId].lvl + 0.5) * nodeHeight + margin
        }

        components.stages = [
          ...components.stages,
          <StudioStoryStage key={'stage-' + stageId}
                            stageId={stageId}
                            x={stagesPos[stageId].x}
                            y={stagesPos[stageId].y}/>
        ]
      }

      if (stageFrom !== null) {
        const actionNotExists = actionsPos[actionFrom] === undefined
        if (actionNotExists) {
          const
            actionParentToStage = stagesSize[stageId].stageParent === stageFrom,
            [actionFromId, actionFromKey] = actionFrom.split('-'),
            actionFromParent = actionParentToStage && firstActionParentDrawn[stageId] === undefined

          if (actionFromParent) {
            firstActionParentDrawn[stageId] = true
          }

          actionsPos[actionFrom] = {
            x: actionsSize[actionFrom].posX + (actionFromParent ? stagesSize[stageId].width : nodeWidth) / 2 + margin,
            y: (actionsSize[actionFrom].lvl + 0.5) * nodeHeight + margin
          }

          components.actions = [
            ...components.actions,
            <StudioStoryNodeAction key={'action-' + actionFrom}
                                   action={nodes.actions[actionFromId][actionFromKey]}
                                   x={actionsPos[actionFrom].x}
                                   y={actionsPos[actionFrom].y}/>
          ]

          components.lines = [
            ...components.lines,
            <StudioStoryLine key={'line-action-' + actionFrom + '-to-stage-' + stageId}
                             fromX={actionsPos[actionFrom].x}
                             fromY={actionsPos[actionFrom].y}
                             toX={stagesPos[stageId].x}
                             toY={stagesPos[stageId].y}
                             arrows={actionParentToStage ? 0 : 2}
                             bezierCoefStart={actionParentToStage ? 35 : 60}
                             bezierCoefEnd={actionParentToStage ? 40 : 90}/>
          ]
        }
        components.lines = [
          ...components.lines,
          <StudioStoryLine key={'line-stage-' + stageFrom + '-to-action-' + actionFrom}
                           fromX={stagesPos[stageFrom].x}
                           fromY={stagesPos[stageFrom].y + nodeHeight / 2 - (nodeHeight - 66)}
                           toX={actionsPos[actionFrom].x}
                           toY={actionsPos[actionFrom].y}
                           arrows={actionNotExists ? 0 : 2}
                           bezierCoefStart={actionNotExists ? 35 : 150}
                           bezierCoefEnd={actionNotExists ? 40 : 90}/>
        ]
      }

      if (!newStage || stage === undefined || stage.ok === null) {
        continue
      }

      nodes.actions[stage.ok.action].reduce(
        (acc, a, k) => {
          stages.push({
            stageId: a.stage,
            stageFrom: stageId,
            actionFrom: stage.ok.action + '-' + k
          })
          return acc
        },
        0
      )
    }

    return components
  }

function StudioStoryEditorGraph({scale}) {
  const
    {story: {nodes}} = useStudioStory(),
    {lines, stages, actions} = useMemo(() => getNodes(nodes), [nodes])

  return <SVGLayout observer={nodes} scale={scale} marginRight={100 / scale} marginBottom={100}>
    {lines}
    {stages}
    {actions}
  </SVGLayout>
}

export default StudioStoryEditorGraph