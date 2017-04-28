import React, { Component } from 'react'
import {
  ScrollView,
  Switch,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { convertDateToLongFormat } from '../Legislation/convert-dates'
import PastAgendas from '../Legislation/PastAgendas'
import BillsList from '../Legislation/BillsList'
const pick = require('lodash/fp/pick')

class NextAgendaContent extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    function getNextAgenda() {
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

    // Refresh every 5 minutes
    this.refreshId = setInterval(() => getNextAgenda(), 5 * 60 * 1000)

    getNextAgenda()
  }

  componentWillUnmount() {
    clearInterval(this.refreshId)
  }

  render() {
    const { dispatch, history, nextAgenda, user } = this.props

    if (!nextAgenda) {
      return (
        <Text style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '300',
          margin: 30,
        }}
        >Loading...</Text>
      )
    }

    const { date, message } = nextAgenda

    if (!date) {
      return (
        <ScrollView>
          <Text style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: '300',
            margin: 30,
          }}
          >{message}</Text>

          <Text style={{
            alignItems: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: '300',
            marginBottom: 30,
            marginHorizontal: 30,
            marginTop: 40,
            textAlign: 'center',
          }}
          >
          Would you like a notification when it's released?
            <Switch
              activeThumbColor="#5CB85C"
              activeTrackColor="#ADDAAD"
              style={{
                display: 'inline-block',
                marginHorizontal: 10,
                position: 'relative',
                top: 2,
                width: 60,
              }}
              thumbColor="#EBA9A7"
              trackColor="#D9534F"
              value={user.legislation_notification}
              onValueChange={() => {
                dispatch({ type: 'TOGGLE_LEGISLATION_NOTIFICATIONS' })
                fetch('https://api.liquid.vote/legislation-notifications', {
                  headers: { Session_ID: this.props.sessionId },
                  method: 'PUT',
                })
              }}
            />
            <Text style={{ display: 'inline-block', width: 35 }}>
              {user.legislation_notification ? 'ON' : 'OFF' }
            </Text>
          </Text>


          <PastAgendas history={history} />
        </ScrollView>
      )
    }

    const { bills } = nextAgenda

    if (!bills) {
      return (
        <ScrollView>
          <Text style={{ color: '#fff', marginTop: 15, textAlign: 'center' }}>
            NO AGENDA FOR {convertDateToLongFormat(date).toUpperCase()}
          </Text>
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '300',
            margin: 30,
          }}
          >{message}</Text>
          <PastAgendas history={history} />
        </ScrollView>
      )
    }

    return (
      <BillsList {...this.props} homescreen match={{ params: { date } }} />
    )
  }
}

NextAgendaContent.disableHeader = true

NextAgendaContent.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }),
  nextAgenda: React.PropTypes.shape(),
  sessionId: React.PropTypes.string.isRequired,
  user: React.PropTypes.shape().isRequired,
}

const mapStateToProps = pick([
  'nextAgenda',
  'sessionId',
  'user',
])

export default connect(mapStateToProps)(NextAgendaContent)
