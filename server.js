// Import the SDK
import WertWidget from '@wert-io/widget-initializer';
import type { Options } from '@wert-io/widget-initializer/types';

// Initialize the payment module
const options: Options = {
partner_id: 'YourPartnerID',
session_id: 'SessionID', // session id recieved from partner.wert.io/api/
origin: 'https://widget.wert.io', // this option needed only in sandbox
}
  
const wertWidget = new WertWidget(options);

wertWidget.open();

// Further code to handle widget events and interactions
