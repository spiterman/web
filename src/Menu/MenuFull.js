import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import CommonStyle from '../CommonStyle'
import MenuLogo from './MenuLogo'
import MenuOption from './MenuOption'

const cstyle = CommonStyle()

function MenuFull({ numRequests, dispatch, history, isLoggedOut, message, style = {} }) {
  const MenuOptionWithNav = props => <MenuOption history={history} {...props} style={{ height: '100%' }} /> // eslint-disable-line

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: cstyle.panelColor,
        borderBottomColor: cstyle.panelBorderColor,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: '4rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        ...style,
      }}
    >

      <MenuLogo history={history} />

      <MenuOptionWithNav text="Legislature" to="/legislation" />
      <MenuOptionWithNav notifications={numRequests} text="Your Delegates" to="/delegates" />
      <MenuOptionWithNav text="About" to="/about" />

      <View style={{ alignItems: 'center', flexDirection: 'row', flexGrow: 1, height: '100%', justifyContent: 'flex-end' }}>
        { isLoggedOut &&
          <MenuOptionWithNav
            text="Sign in"
            to="/sign-in"
          />
        }

        { !isLoggedOut &&
          <MenuOptionWithNav
            style={{ color: cstyle.menuHoverColor }}
            text={message}
            to="/voting-power"
          />
        }

        { !isLoggedOut &&
          <MenuOptionWithNav
            text="Sign out"
            onPress={() => {
              dispatch({ type: 'LOGOUT' })
              history.replace('/')
            }}
          />
        }
      </View>
    </View>
  )
}

MenuFull.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  history: React.PropTypes.shape({}).isRequired,
  isLoggedOut: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  numRequests: React.PropTypes.number,
  style: React.PropTypes.shape({}),
}

const mapStateToProps = state => ({
  constituents: state.constituents,
  user: state.user,
  votingPower: state.votingPower,
})

export default connect(mapStateToProps)(MenuFull)