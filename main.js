import WertWidget from '@wert-io/widget-initializer';

class WertIntegration {
    constructor() {
        this.wertWidget = null;
        this.apiBaseUrl = 'https://your-railway-app.railway.app'; // Replace with your Railway app URL
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.validateInputs();
    }

    setupEventListeners() {
        // Purchase button
        const purchaseBtn = document.getElementById('purchase-btn');
        purchaseBtn.addEventListener('click', () => {
            this.initiatePurchase();
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

        // Error modal
        const closeErrorBtn = document.getElementById('close-error');
        closeErrorBtn.addEventListener('click', () => {
            this.hideErrorModal();
        });

        // Input validation
        const inputs = ['wallet-address', 'purchase-amount', 'user-email'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.addEventListener('input', () => {
                this.validateInputs();
            });
        });
    }

    validateInputs() {
        const walletAddress = document.getElementById('wallet-address').value.trim();
        const amount = document.getElementById('purchase-amount').value;
        const email = document.getElementById('user-email').value.trim();
        const purchaseBtn = document.getElementById('purchase-btn');

        const isValidWallet = this.validateBitcoinAddress(walletAddress);
        const isValidAmount = amount >= 50 && amount <= 10000;
        const isValidEmail = this.validateEmail(email);

        const isValid = isValidWallet && isValidAmount && isValidEmail;
        purchaseBtn.disabled = !isValid;

        return isValid;
    }

    validateBitcoinAddress(address) {
        // Basic Bitcoin address validation
        const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
        return btcRegex.test(address);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async initiatePurchase() {
        if (!this.validateInputs()) {
            this.showError('Please fill in all fields correctly');
            return;
        }

        this.showLoader(true);

        try {
            const sessionData = await this.createWertSession();
            await this.openWertWidget(sessionData.session_id);
        } catch (error) {
            console.error('Error initiating purchase:', error);
            this.showLoader(false);
            this.showError(error.message || 'Failed to initialize payment. Please try again.');
        }
    }

    async createWertSession() {
        const walletAddress = document.getElementById('wallet-address').value.trim();
        const amount = document.getElementById('purchase-amount').value;
        const email = document.getElementById('user-email').value.trim();

        const sessionData = {
            partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
            origin: "https://widget.wert.io",
            commodity: "BTC",
            commodity_amount: this.calculateBtcAmount(amount),
            fiat_currency: "USD",
            fiat_amount: parseFloat(amount),
            network: "bitcoin",
            address: walletAddress,
            user_email: email,
            extra: {
                wallets: [
                    {
                        name: "BTC",
                        network: "bitcoin",
                        address: walletAddress
                    }
                ]
            }
        };

        const response = await fetch(`${this.apiBaseUrl}/api/create-wert-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    calculateBtcAmount(usdAmount) {
        // In production, get real-time BTC price from your backend
        // This is a simplified calculation
        const btcPriceUsd = 45000; // Example price
        return (parseFloat(usdAmount) / btcPriceUsd).toFixed(8);
    }

    async openWertWidget(sessionId) {
        try {
            const options = {
                partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
                container_id: 'wert-widget-container',
                session_id: sessionId,
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
                
                listeners: {
                    loaded: () => {
                        console.log('Wert widget loaded successfully');
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
                        this.showError('Payment widget error. Please try again.');
                    },
                    payment_status: (data) => {
                        console.log('Payment status update:', data);
                        this.handlePaymentStatus(data);
                    }
                }
            };

            this.wertWidget = new WertWidget(options);
            this.wertWidget.open();

        } catch (error) {
            console.error('Error opening Wert widget:', error);
            this.showLoader(false);
            this.showError('Failed to open payment widget. Please try again.');
        }
    }

    handlePaymentStatus(data) {
        switch (data.status) {
            case 'pending':
                console.log('Payment is pending');
                break;
            case 'success':
                console.log('Payment successful!');
                this.showSuccessMessage(data);
                break;
            case 'failed':
                console.log('Payment failed');
                this.showError('Payment failed. Please try again or contact support.');
                break;
            default:
                console.log('Payment status update:', data.status);
        }
    }

    showSuccessMessage(data) {
        alert(`Payment successful! Transaction ID: ${data.tx_id || 'N/A'}\n\nYour Bitcoin will be sent to your wallet shortly.`);
        this.closeWidget();
        this.resetForm();
    }

    resetForm() {
        document.getElementById('wallet-address').value = '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv';
        document.getElementById('purchase-amount').value = '100';
        document.getElementById('user-email').value = '';
        this.validateInputs();
    }

    showLoader(show) {
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        const purchaseBtn = document.getElementById('purchase-btn');

        if (show) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            purchaseBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            this.validateInputs(); // Re-enable button based on validation
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

    showError(message) {
        const errorModal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideErrorModal() {
        const errorModal = document.getElementById('error-modal');
        errorModal.classList.add('hidden');
        document.body.style.overflow = '';
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
    window.wertIntegration = new WertIntegration();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.wertIntegration && window.wertIntegration.wertWidget) {
        window.wertIntegration.closeWidget();
    }
});