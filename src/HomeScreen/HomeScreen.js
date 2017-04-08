import React, { Component } from 'react'
import { connect } from 'react-redux'
import Drawer from 'react-native-drawer'
import deepEqual from 'deep-equal'
import LinearGradient from 'react-native-linear-gradient'
import Menu from './Menu'
import HomeScreenHeader from './HomeScreenHeader'
import NextAgendaScreen from './NextAgendaScreen'
import HomeScreenFooter from './HomeScreenFooter'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    // Refresh every 5 minutes
    this.refreshId = setInterval(() => this.getUserInfoFromServer(props), 5 * 60 * 1000)

    this.getUserInfoFromServer(props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isVerified !== nextProps.isVerified) {
      this.getUserInfoFromServer(nextProps)
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshId)
  }

  getUserInfoFromServer(props) {
    // Get voting_power
    if (!props.isVerified) {
      props.dispatch({ type: 'SYNC_VOTING_POWER', votingPower: 0 })
    } else {
      fetch('https://api.liquid.vote/my-voting-power', { headers: { Session_ID: props.sessionId } })
      .then((response) => {
        if (response.status === 401) { return props.navigator.push({ name: 'InvalidSessionScreen' }) }

        return response.json()
        .then(({ voting_power }) => props.dispatch({ type: 'SYNC_VOTING_POWER', votingPower: voting_power }))
      })
    }

    // Get delegates from the server
    if (!props.isVerified) {
      props.dispatch({ delegates: [], type: 'SYNC_DELEGATES' })
    } else {
      fetch('https://api.liquid.vote/my-delegates', { headers: { Session_ID: props.sessionId } })
      .then(response => response.json())
      .then((serverDelegates) => {
        if (!deepEqual(serverDelegates, this.state.delegates)) {
          props.dispatch({ delegates: serverDelegates, type: 'SYNC_DELEGATES' })
        }
      })
    }

    // Get constituents from the server
    if (!props.isVerified) {
      props.dispatch({ constituents: { approved: [], rejected: [], requests: [] }, type: 'SYNC_CONSTITUENTS' })
    } else {
      // Get delegation approvals, rejections, and requests from the server
      fetch('https://api.liquid.vote/my-delegation-permissions', { headers: { Session_ID: props.sessionId } })
        .then(response => response.json())
        .then(constituents => props.dispatch({ constituents, type: 'SYNC_CONSTITUENTS' }))
    }

    fetch('https://api.liquid.vote/next-agenda')
      .then(response => response.json())
      .then((nextAgenda) => {
        props.dispatch({ nextAgenda, type: 'SYNC_NEXT_AGENDA' })

        // Did nextAgenda not include bills?
        // (Upcoming break, or agenda hasn't been published yet)
        if (!nextAgenda.bills) {
          return
        }

        const { bills, date } = nextAgenda
        props.dispatch({ bills, date, type: 'SYNC_BILLS' })
      })
  }

  render() {
    return (
      <Drawer
        tapToClose
        content={<Menu closeDrawer={() => this.drawer.close()} navigator={this.props.navigator} />}
        openDrawerOffset={100}
        ref={(ref) => { this.drawer = ref }}
        tweenHandler={ratio => ({
          drawer: { left: -150 * (1 - ratio) },
          mainOverlay: {
            backgroundColor: '#000',
            opacity: ratio / 1.1,
          },
        })}
        type="static"
      >
        <HomeScreenHeader navigator={this.props.navigator} openDrawer={() => this.drawer.open()} />
        <LinearGradient
          colors={['#000', '#292929']}
          style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-start' }}
        >
          <NextAgendaScreen navigator={this.props.navigator} />
          <HomeScreenFooter navigator={this.props.navigator} />
        </LinearGradient>
      </Drawer>
    )
  }
}

HomeScreen.disableHeader = true

HomeScreen.propTypes = {
  isVerified: React.PropTypes.bool.isRequired,
  navigator: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }),
}

const mapStateToProps = state => ({ isVerified: state.isVerified, sessionId: state.sessionId })

export default connect(mapStateToProps)(HomeScreen)
