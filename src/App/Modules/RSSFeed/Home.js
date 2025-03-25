import TopBar from '../../Layout/TopBar/TopBar.js'
import AppContainer from '../../Layout/Container/AppContainer.js'
import RSSFeedList from './List.js'

function FeedRSSHome () {
  return <>
    <TopBar currentModule="RSSFeed"/>
    <AppContainer>
      <RSSFeedList/>
    </AppContainer>
  </>
}

export default FeedRSSHome
