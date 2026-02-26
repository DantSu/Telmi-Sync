import styles from './StudioGraph.module.scss'

function StudioStoryNodeActionCondition({text}) {
  return <li className={styles.nodeActionCondition}>{text}</li>
}

export default StudioStoryNodeActionCondition