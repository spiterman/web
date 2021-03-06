import React, { Component } from 'react'
import { compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import localForage from 'localforage'
import devTools from 'remote-redux-devtools'
import Screens from './_screens'
import reducer, { initialState } from './_reducer'


const store = createStore(reducer, initialState, compose(autoRehydrate(), devTools()))
// Store session info to device so it's not lost when closed
persistStore(store, { storage: localForage,
  whitelist: ['billSort', 'isVerified', 'knownNumbers', 'sessionId', 'user'],
})

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // Ping server to wake it up
    fetch('https://api.liquid.vote')
  }

  render() {
    return (
      <Provider store={store}>
        <Screens />
      </Provider>
    )
  }
}
