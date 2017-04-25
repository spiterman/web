import React, { Component } from 'react'
import {
  ScrollView,
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
    const { navigator, nextAgenda } = this.props

    if (!nextAgenda) {
      return (
        <Text style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '300',
          marginHorizontal: 30,
          marginTop: 20,
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
            marginHorizontal: 30,
            marginTop: 20,
          }}
          >{message}</Text>
          <PastAgendas navigator={navigator} />
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
            marginHorizontal: 30,
            marginTop: 30,
          }}
          >{message}</Text>
          <PastAgendas navigator={navigator} />
        </ScrollView>
      )
    }

    return (
      <BillsList {...this.props} homescreen route={{ date }} />
    )
  }
}

NextAgendaContent.disableHeader = true

NextAgendaContent.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  navigator: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }),
  nextAgenda: React.PropTypes.shape(),
}

const mapStateToProps = pick([
  'nextAgenda',
  'sessionId',
])

export default connect(mapStateToProps)(NextAgendaContent)
