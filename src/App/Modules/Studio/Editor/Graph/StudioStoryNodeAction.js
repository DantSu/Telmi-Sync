import {useCallback} from 'react'
import {SVG_ANCHOR_CENTER, SVG_ANCHOR_MIDDLE} from '../../../../Components/SVG/SVGConstants.js'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'
import {getComparisonOperators} from '../StudioNodesHelpers.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'
import ButtonIconMinus from '../../../../Components/Buttons/Icons/ButtonIconMinus.js'
import StudioStoryNodeActionCondition from './StudioStoryNodeActionCondition.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeAction({action, actionId, actionKey, x, y}) {
  const
    {getLocale} = useLocale(),
    {story: {nodes}} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    hasConditions = Array.isArray(action.conditions) && action.conditions.length > 0,
    conditionsText = !hasConditions ? [] : action.conditions.map((condition) => {
      const
        item = nodes.inventory.find((v) => v.id === condition.item)
      return item.name + ' ' +
        getComparisonOperators()[condition.comparator] + ' ' +
        (condition.number !== undefined ? condition.number : '') +
        (condition.compareItem !== undefined ? nodes.inventory.find((v) => v.id === condition.compareItem).name : '')
    }),
    onDelete = useCallback(
      () => updateStory((s) => {
        s.nodes.actions[actionId].splice(actionKey, 1)
        return {...s, nodes: {...s.nodes}}
      }),
      [actionId, actionKey, updateStory]
    )
  return <>
    <SVGHtml x={x}
             y={y}
             width={64}
             height={64}
             anchorX={SVG_ANCHOR_CENTER}
             anchorY={SVG_ANCHOR_MIDDLE}>
      <div className={styles.nodeActionContainer}
           onMouseDown={(e) => {
             e.stopPropagation()
           }}>
        <ul className={styles.nodeAction} title={conditionsText.join('\n')}>
          <li className={hasConditions ? styles.nodeActionDeleteContainer : undefined}>
            <ButtonIconMinus className={styles.nodeActionDelete}
                             rounded={true}
                             title={getLocale('action-delete')}
                             onClick={onDelete}/>
          </li>
          {conditionsText.slice(0, 3).map(
            (text, k) => <StudioStoryNodeActionCondition key={'story-action-condition-' + k} text={text}/>
          )}
          {conditionsText.length > 3 && <li className={styles.nodeActionEllipsis}>...</li>}
        </ul>
      </div>
    </SVGHtml>
    <circle cx={x} cy={y} r={6} fill="#FFFFFF" />
  </>
}

export default StudioStoryNodeAction