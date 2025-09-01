import WertWidget from '@wert-io/widget-initializer';

class WertIntegration {
    constructor() {
        this.selectedCurrency = 'BTC';
        this.wertWidget = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Currency selection
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectCurrency(e.currentTarget);
            });
        });

        // Purchase button
        const purchaseBtn = document.getElementById('open-widget');
        purchaseBtn.addEventListener('click', () => {
            this.openWertWidget();
        });

        // Close overlay
        const closeBtn = document.getElementById('close-overlay');
        const overlay = document.getElementById('widget-overlay');
        
        closeBtn.addEventListener('click', () => {
            this.closeWidget();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeWidget();
            }
        });

        // Input validation
        const walletInput = document.getElementById('wallet-address');
        const amountInput = document.getElementById('purchase-amount');

        walletInput.addEventListener('input', () => {
            this.validateInputs();
        });

        amountInput.addEventListener('input', () => {
            this.validateInputs();
        });
    }

    selectCurrency(selectedCard) {
        // Remove active class from all cards
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        selectedCard.classList.add('active');
        this.selectedCurrency = selectedCard.dataset.currency;
        this.updateUI();
    }

    validateInputs() {
        const walletAddress = document.getElementById('wallet-address').value.trim();
        const amount = document.getElementById('purchase-amount').value;
        const purchaseBtn = document.getElementById('open-widget');

        const isValid = walletAddress.length > 0 && amount >= 50 && amount <= 10000;
        purchaseBtn.disabled = !isValid;
    }

    updateUI() {
        this.validateInputs();
    }

    async openWertWidget() {
        const walletAddress = document.getElementById('wallet-address').value.trim();
        const amount = document.getElementById('purchase-amount').value;

        if (!walletAddress || !amount) {
            alert('Please fill in all required fields');
            return;
        }

        this.showLoader(true);

        try {
            // Generate a unique session ID (in production, get this from your backend)
            const sessionId = this.generateSessionId();

            const options = {
                partner_id: 'YOUR_PARTNER_ID', // Replace with your actual partner ID
                container_id: 'wert-widget-container',
                click_id: sessionId,
                origin: 'https://widget.wert.io',
                theme: 'light',
                color_buttons: '#667eea',
                color_secondary_buttons: '#764ba2',
                color_main_text: '#2d3748',
                color_secondary_text: '#718096',
                color_icons: '#667eea',
                color_links: '#667eea',
                color_success: '#48bb78',
                color_warning: '#ed8936',
                color_error: '#f56565',
                
                // Transaction parameters
                commodity: this.selectedCurrency,
                commodity_amount: this.getCommodityAmount(amount),
                network: this.getNetworkForCurrency(this.selectedCurrency),
                address: walletAddress,
                
                // Additional options
                auto_redirect: false,
                hide_address: false,
                hide_amount: false,
                
                // Listeners for widget events
                listeners: {
                    loaded: () => {
                        console.log('Wert widget loaded');
                        this.showLoader(false);
                        this.showOverlay(true);
                    },
                    close: () => {
                        console.log('Wert widget closed');
                        this.closeWidget();
                    },
                    error: (error) => {
                        console.error('Wert widget error:', error);
                        this.showLoader(false);
                        alert('Error loading payment widget. Please try again.');
                    },
                    payment_status: (data) => {
                        console.log('Payment status:', data);
                        this.handlePaymentStatus(data);
                    }
                }
            };

            this.wertWidget = new WertWidget(options);
            this.wertWidget.open();

        } catch (error) {
            console.error('Error initializing Wert widget:', error);
            this.showLoader(false);
            alert('Error initializing payment widget. Please try again.');
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getCommodityAmount(usdAmount) {
        // In production, you would get real-time exchange rates
        // This is a simplified example
        const exchangeRates = {
            'BTC': 0.000025, // Approximate BTC per USD
            'ETH': 0.0004,   // Approximate ETH per USD
            'USDC': 1        // 1:1 for stablecoin
        };

        return (parseFloat(usdAmount) * exchangeRates[this.selectedCurrency]).toFixed(8);
    }

    getNetworkForCurrency(currency) {
        const networks = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDC': 'ethereum'
        };

        return networks[currency] || 'ethereum';
    }

    handlePaymentStatus(data) {
        switch (data.status) {
            case 'pending':
                console.log('Payment is pending');
                break;
            case 'success':
                console.log('Payment successful!');
                this.showSuccessMessage();
                break;
            case 'failed':
                console.log('Payment failed');
                this.showErrorMessage();
                break;
            default:
                console.log('Unknown payment status:', data.status);
        }
    }

    showSuccessMessage() {
        // You can customize this success handling
        alert('Payment successful! Your cryptocurrency will be sent to your wallet shortly.');
        this.closeWidget();
    }

    showErrorMessage() {
        // You can customize this error handling
        alert('Payment failed. Please try again or contact support.');
    }

    showLoader(show) {
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        const purchaseBtn = document.getElementById('open-widget');

        if (show) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            purchaseBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            purchaseBtn.disabled = false;
        }
    }

    showOverlay(show) {
        const overlay = document.getElementById('widget-overlay');
        if (show) {
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    closeWidget() {
        this.showOverlay(false);
        if (this.wertWidget) {
            this.wertWidget.close();
            this.wertWidget = null;
        }
        
        // Clear the widget container
        const container = document.getElementById('wert-widget-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WertIntegration();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.wertIntegration && window.wertIntegration.wertWidget) {
        window.wertIntegration.closeWidget();
    }
});