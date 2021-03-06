import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import BillScreen from './BillScreen'

function LoadBillScreen({ bills, history, location, dispatch, match }) {
  const { date, bill_id } = match.params
  const bill_uid = `${date}-${bill_id}`

  let message = `Loading bill ${bill_uid}...`
  if (bills[date]) {
    const bill = bills[date].filter(b => b.uid === bill_uid)[0]
    if (!bill) {
      message = `Bill ${bill_uid} not found`
    } else {
      return <BillScreen bill={bill} history={history} location={location} />
    }
  } else {
    fetch(`https://api.liquid.vote/bills/${date}`)
    .then(response => response.json())
    .then(loadedBills => dispatch({ bills: loadedBills, date, type: 'SYNC_BILLS' }))
  }

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <Text style={{ color: '#fff' }}>{message}</Text>
    </View>
  )
}

LoadBillScreen.disableHeader = true

LoadBillScreen.propTypes = {
  bills: React.PropTypes.shape(),
  dispatch: React.PropTypes.func.isRequired,
  history: React.PropTypes.shape().isRequired,
  location: React.PropTypes.shape().isRequired,
  match: React.PropTypes.shape({
    params: React.PropTypes.shape({}).isRequired,
  }).isRequired,
}

const mapStateToProps = state => ({
  bills: state.bills,
})

export default connect(mapStateToProps)(LoadBillScreen)
