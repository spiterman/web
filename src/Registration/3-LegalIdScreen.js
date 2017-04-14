import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Header from './Header'

function LegalIdScreen({ navigator }) {
  return (
    <View>
      <Header navigator={navigator} step={3} title="LEGAL ID" />

      <Text style={{
        color: '#fff',
        fontSize: 18,
        fontWeight: '200',
        marginHorizontal: 30,
        marginVertical: 70,
      }}
      >We need a legal ID, such as a driver{"'"}s license, to confirm your identity.</Text>

      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          alignItems: 'center',
          borderColor: '#344184',
          borderRadius: 30,
          borderWidth: 3,
          height: 58,
          justifyContent: 'center',
          marginBottom: 20,
          marginHorizontal: 30,
        }}
        onPress={() => navigator.push({ name: 'CameraScreen', transition: null })}
      >
        <Text style={{ color: '#fff', fontFamily: 'HelveticaNeue, Helvetica', fontSize: 16, fontWeight: '600' }}>
          TAKE PHOTO OF ID
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          alignItems: 'center',
          borderColor: '#344184',
          borderRadius: 30,
          borderWidth: 3,
          height: 58,
          justifyContent: 'center',
          marginHorizontal: 30,
        }}
        onPress={() => navigator.push({ name: 'EmailScreen', transition: null })}
      >
        <Text style={{ color: '#fff', fontFamily: 'HelveticaNeue, Helvetica', fontSize: 16, fontWeight: '600' }}>
          SKIP FOR NOW
        </Text>
      </TouchableOpacity>

    </View>
  )
}

LegalIdScreen.disableHeader = true

LegalIdScreen.propTypes = {
  navigator: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }),
}

export default LegalIdScreen
