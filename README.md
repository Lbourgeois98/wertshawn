# Wert.io Fiat Onramp Widget

A production-ready implementation of the Wert.io fiat onramp widget for purchasing cryptocurrency with fiat currency.

## Features

- 🚀 Production-ready Wert.io integration
- 💳 Support for multiple payment methods (credit card, debit card, bank transfer)
- 🪙 Multiple cryptocurrency support (BTC, ETH, USDC)
- 📱 Fully responsive design
- 🎨 Modern, Apple-inspired UI/UX
- 🔒 Secure payment processing
- ⚡ Real-time transaction status updates

## Setup Instructions

### 1. Get Wert.io Credentials

1. Visit [Wert Partner Portal](https://partner.wert.io/)
2. Create an account and complete the onboarding process
3. Get your Partner ID from the dashboard
4. Configure your webhook endpoints (optional)

### 2. Configure the Application

1. Open `config.js`
2. Replace `YOUR_PARTNER_ID` with your actual Wert partner ID
3. Update other configuration values as needed:

```javascript
export const WERT_CONFIG = {
    PARTNER_ID: 'your_actual_partner_id_here',
    ENVIRONMENT: 'production', // or 'sandbox' for testing
    // ... other config
};
```

### 3. Customize Supported Currencies

Edit the `SUPPORTED_CURRENCIES` object in `config.js` to add or remove cryptocurrencies:

```javascript
SUPPORTED_CURRENCIES: {
    'BTC': {
        name: 'Bitcoin',
        network: 'bitcoin',
        symbol: '₿'
    },
    // Add more currencies as needed
}
```

### 4. Deploy to Production

This application can be deployed to any static hosting service:

- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable Pages in repository settings
- **AWS S3**: Upload files to S3 bucket with static hosting

## Development

To run locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Considerations

### Security
- Never expose sensitive credentials in client-side code
- Implement proper wallet address validation
- Use HTTPS in production
- Consider implementing rate limiting

### User Experience
- Add loading states for better UX
- Implement proper error handling
- Add transaction history tracking
- Consider adding email notifications

### Compliance
- Ensure compliance with local regulations
- Implement KYC/AML procedures if required
- Add proper terms of service and privacy policy

## Widget Events

The widget handles several important events:

- `loaded`: Widget successfully loaded
- `close`: User closed the widget
- `error`: Error occurred during widget initialization
- `payment_status`: Real-time payment status updates

## Customization

### Styling
- Modify `styles.css` to match your brand colors
- Update the gradient backgrounds and button styles
- Customize the responsive breakpoints

### Functionality
- Add more cryptocurrencies in the configuration
- Implement custom validation logic
- Add analytics tracking
- Integrate with your existing user system

## Support

For Wert.io specific issues:
- [Wert.io Documentation](https://docs.wert.io/)
- [Wert.io Support](https://support.wert.io/)

## License

This implementation is provided as-is for educational and commercial use.