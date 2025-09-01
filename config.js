// Wert.io Configuration
// IMPORTANT: Replace these values with your actual production credentials

export const WERT_CONFIG = {
    // Get your partner ID from https://partner.wert.io/
    PARTNER_ID: 'YOUR_PARTNER_ID', // Replace with your actual partner ID
    
    // Production environment settings
    ENVIRONMENT: 'production', // Change to 'sandbox' for testing
    
    // Widget appearance
    THEME: {
        primary_color: '#667eea',
        secondary_color: '#764ba2',
        background_color: '#ffffff',
        text_color: '#2d3748'
    },
    
    // Supported currencies and networks
    SUPPORTED_CURRENCIES: {
        'BTC': {
            name: 'Bitcoin',
            network: 'bitcoin',
            symbol: '₿'
        },
        'ETH': {
            name: 'Ethereum',
            network: 'ethereum',
            symbol: 'Ξ'
        },
        'USDC': {
            name: 'USD Coin',
            network: 'ethereum',
            symbol: '$'
        }
    },
    
    // Transaction limits
    LIMITS: {
        min_amount: 50,
        max_amount: 10000,
        default_amount: 100
    }
};

// Environment-specific settings
export const getWertOrigin = () => {
    return WERT_CONFIG.ENVIRONMENT === 'sandbox' 
        ? 'https://sandbox.wert.io' 
        : 'https://widget.wert.io';
};

// Validation helpers
export const validateWalletAddress = (address, currency) => {
    if (!address || address.trim().length === 0) {
        return { valid: false, error: 'Wallet address is required' };
    }

    // Basic validation - in production, use more robust validation
    const patterns = {
        'BTC': /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
        'ETH': /^0x[a-fA-F0-9]{40}$/,
        'USDC': /^0x[a-fA-F0-9]{40}$/
    };

    const pattern = patterns[currency];
    if (pattern && !pattern.test(address)) {
        return { 
            valid: false, 
            error: `Invalid ${currency} wallet address format` 
        };
    }

    return { valid: true };
};

export const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
        return { valid: false, error: 'Amount must be a valid number' };
    }
    
    if (numAmount < WERT_CONFIG.LIMITS.min_amount) {
        return { 
            valid: false, 
            error: `Minimum amount is $${WERT_CONFIG.LIMITS.min_amount}` 
        };
    }
    
    if (numAmount > WERT_CONFIG.LIMITS.max_amount) {
        return { 
            valid: false, 
            error: `Maximum amount is $${WERT_CONFIG.LIMITS.max_amount}` 
        };
    }
    
    return { valid: true };
};