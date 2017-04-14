/* eslint global-require: 0 */

export default {
  AboutScreen: require('./AboutScreen').default,
  AddressScreen: require('./Registration/2.5-AddressScreen').default,
  AgendaScreen: require('./Legislation/AgendaScreen').default,
  AuditScreen: require('./Legislation/AuditScreen').default,
  AuthErrorScreen: require('./AuthErrorScreen').default,
  BillScreen: require('./Legislation/BillScreen').default,
  BoardScreen: require('./ElectedRep/BoardScreen').default,
  CameraScreen: require('./Registration/3.3-CameraScreen').default,
  ConfirmDelegateScreen: require('./Delegation/ConfirmDelegateScreen').default,
  ConfirmNewNumberScreen: require('./Login/1.8-ConfirmNewNumberScreen').default,
  ConfirmVoteScreen: require('./Legislation/ConfirmVoteScreen').default,
  DelegateInfoScreen: require('./Delegation/DelegateInfoScreen').default,
  DelegatesScreen: require('./Delegation/DelegatesScreen').default,
  DistrictsMapScreen: require('./ElectedRep/DistrictsMapScreen').default,
  ElectedRepScreen: require('./ElectedRep/ElectedRepScreen').default,
  EmailScreen: require('./Registration/4-EmailScreen').default,
  EnterSMSCodeScreen: require('./Login/z-EnterSMSCodeScreen').default,
  FeedbackScreen: require('./FeedbackScreen').default,
  FirstNameScreen: require('./Registration/1-FirstNameScreen').default,
  HomeScreen: require('./HomeScreen/HomeScreen').default,
  IdReviewScreen: require('./Registration/3.6-IdReviewScreen').default,
  LastNameScreen: require('./Registration/1.5-LastNameScreen').default,
  LegalIdScreen: require('./Registration/3-LegalIdScreen').default,
  LoadBillScreen: require('./Legislation/LoadBillScreen').default,
  LoginScreen: require('./Login/LoginScreen').default,
  RegistrationIntroScreen: require('./Registration/0-RegistrationIntroScreen').default,
  RequestsScreen: require('./Delegation/RequestsScreen').default,
  ThankYouScreen: require('./Registration/5-ThankYouScreen').default,
  VotingPowerScreen: require('./VotingPowerScreen/VotingPowerScreen').default,
  YourRegistrationScreen: require('./Registration/YourRegistrationScreen').default,
  ZipScreen: require('./Registration/2-ZipScreen').default,
}
