import URL from 'url'
import React, { Component } from 'react'
import { AppState, Linking, View } from 'react-native'
import { compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import localForage from 'localforage'
import devTools from 'remote-redux-devtools'
import _ from 'lodash'
import screens from './_screens'
import reducer, { initialState } from './_reducer'
import Header from './Header'

const INITIAL_ROUTE = { name: 'LoginScreen' }

const store = createStore(reducer, initialState, compose(autoRehydrate(), devTools()))
// Store session info to device so it's not lost when closed
persistStore(store, { storage: localForage,
  whitelist: ['billSort', 'isVerified', 'sessionId', 'user'],
})

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      stack: [INITIAL_ROUTE],
    }
  }

  componentDidMount() {
    // Ping server to wake it up
    fetch('https://api.liquid.vote')
    // And when app comes back from background
    AppState.addEventListener('change', (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        fetch('https://api.liquid.vote')
      }
      this.setState({ appState: nextAppState })
    })

    Linking.addEventListener('url', (event) => {
      if (event.url) {
        const parsedUrl = URL.parse(event.url, true)

        if (parsedUrl.path.slice(1, 5) === 'bill') {
          const bill_uid = parsedUrl.path.slice(6, 23)
          this.navigator.immediatelyResetRouteStack([
            { name: 'LoginScreen' },
            { name: 'HomeScreen' },
            { bill_uid, name: 'LoadBillScreen' },
          ])
        }
      }
    })
  }

  render() {
    const route = _.last(this.state.stack)
    const Screen = screens[route.name]
    const navigator = {
      pop: () => {
        const newStack = [...this.state.stack]
        newStack.pop()
        this.setState({
          stack: newStack,
        })
      },
      push: (newRoute) => {
        this.setState({
          stack: [...this.state.stack, newRoute],
        })
      },
      replace: (newRoute) => {
        const newStack = [...this.state.stack]
        newStack.pop(); newStack.push(newRoute)
        this.setState({
          stack: newStack,
        })
      },
      resetTo: (newRoute) => {
        this.setState({
          stack: [newRoute],
        })
      },
    }

    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'flex-start',
              marginHorizontal: 'auto',
            }}
          >
            <Header navigator={navigator} route={route} />
            <Screen navigator={navigator} route={route} />
          </View>
        </View>
      </Provider>
    )
  }
}
