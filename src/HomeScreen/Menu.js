import React from 'react'
import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import logo from '../logo.png'
import Link from './Link'

function Menu({ closeDrawer, constituents, dispatch, navigator, user }) {
  const MenuOption = props => <Link closeDrawer={closeDrawer} navigator={navigator} {...props} /> // eslint-disable-line

  let numRequests
  if (constituents && constituents.requests) {
    numRequests = constituents.requests.length
  }

  const smallScreen = Dimensions.get('window').height < 600

  let first_name = user.first_name
  if (!first_name) {
    first_name = 'UNREGISTERED'
  }

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Image
        source={logo}
        style={{ alignSelf: 'center', height: 75, marginBottom: 12, marginTop: 20, width: 79 }}
      />
      <Text
        style={{
          color: '#fff',
          fontSize: 19,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >LIQUID DEMOCRACY</Text>

      <TouchableOpacity
        style={{ marginVertical: 20 }}
        onPress={() => navigator.push({ name: 'YourRegistrationScreen', transition: 'SwipeFromLeft' })}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 21,
            fontWeight: '200',
            marginVertical: 20,
            textAlign: 'center',
          }}
        >Hello, {first_name}</Text>
      </TouchableOpacity>

      <View>
        <MenuOption text="YOUR DELEGATES" to="DelegatesScreen" />
        <MenuOption notifications={numRequests} text="REQUESTS" to="RequestsScreen" />
        <MenuOption text="ABOUT" to="AboutScreen" />
        <MenuOption style={{ marginTop: 30 }} text="SEND FEEDBACK" to="FeedbackScreen" />
        <MenuOption
          style={{ marginTop: 30 }}
          text="LOG OUT" onPress={() => {
            dispatch({ type: 'LOGOUT' })
            navigator.resetTo({ name: 'LoginScreen' })
          }}
        />

        <View style={{ flexDirection: 'row', marginTop: smallScreen ? 0 : 20 }}>
          <TouchableOpacity
            style={{ marginLeft: 30, padding: 10 }}
            onPress={() => {
              Linking.openURL('https://twitter.com/liquid_vote')
              .catch(() => {})
            }}
          >
            <Icon color="white" name="twitter" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 10, padding: 10 }}
            onPress={() => {
              Linking.openURL('https://facebook.com/liquidvote')
              .catch(() => {})
            }}
          >
            <Icon color="white" name="facebook" size={18} />
          </TouchableOpacity>
        </View>

      </View>

    </View>
  )
}

Menu.propTypes = {
  closeDrawer: React.PropTypes.func.isRequired,
  constituents: React.PropTypes.shape({}),
  dispatch: React.PropTypes.func.isRequired,
  navigator: React.PropTypes.shape({
    resetTo: React.PropTypes.func.isRequired,
  }),
  user: React.PropTypes.shape({}),
}

const mapStateToProps = state => ({
  constituents: state.constituents,
  user: state.user,
})

export default connect(mapStateToProps)(Menu)
