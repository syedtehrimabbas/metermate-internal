import {getPurchaseHistory} from 'react-native-iap';
import {SubscriptionHistoryItem, SubscriptionStatus, updateSubscription} from '../redux';
import {Platform} from "react-native";

export const checkUserSubscription = async () => {
    try {
        const purchases = await getPurchaseHistory();
        // console.log('Purchase history:', JSON.stringify(purchases, null, 2));

        return purchases.some(purchase => {
            try {
                const platform = Platform.OS;

                let productId: string | undefined;
                let isActive = false;

                // Android-specific
                if (platform === 'android') {
                    const androidData = purchase.dataAndroid
                        ? JSON.parse(purchase.dataAndroid)
                        : null;

                    productId = androidData?.productId || purchase.productId;

                    isActive =
                        purchase.purchaseStateAndroid === 1 || // Purchased
                        purchase.purchaseState === 'Purchased' ||
                        purchase.purchaseState === 'Restored' ||
                        (androidData && Date.now() < androidData.purchaseTime + 30 * 24 * 60 * 60 * 1000); // Within 30 days
                }

                // iOS-specific
                else if (platform === 'ios') {
                    console.log("here")
                    productId = purchase.productId;

                    // For StoreKit2, check ownership status or expiry if available
                    if ('ownershipType' in purchase) {
                        isActive =
                            purchase.ownershipType === 'PURCHASED' || purchase.ownershipType === 'FAMILY_SHARED';
                    } else if ('transactionDate' in purchase) {
                        const purchaseTime = Number(purchase.transactionDate);
                        const expirationTime = purchase.expirationDate
                            ? Number(purchase.expirationDate)
                            : purchaseTime + 30 * 24 * 60 * 60 * 1000; // Fallback

                        isActive = Date.now() < expirationTime;
                    } else {
                        // Fallback if no known fields exist
                        isActive = true;
                    }
                }

                const isValidSubscription = [
                    'metermate_monthly',
                    'com.metermate.yearly',
                ].includes(productId || '');

                return isActive && isValidSubscription;
            } catch (e) {
                console.error('Error parsing purchase:', e);
                return false;
            }
        });
    } catch (error) {
        console.error('Failed to check subscription:', error);
        return false;
    }
};

export const checkAndUpdateSubscription = async (dispatch: any) => {
    try {
        const purchases = await getPurchaseHistory();
        console.log('Raw purchase data:', JSON.stringify(purchases, null, 2));

        // Process and find active subscriptions
        let activeSubscription: 'monthly' | 'yearly' | null = null;
        const subscriptionHistory: SubscriptionHistoryItem[] = []; // Explicitly typed

        for (const purchase of purchases) {
            try {
                // Parse Android data if available
                const androidData = purchase.dataAndroid ? JSON.parse(purchase.dataAndroid) : null;
                const productId = androidData?.productId || purchase.productId;
                const purchaseTime = androidData?.purchaseTime || purchase.transactionDate;

                // Check if this is one of our subscriptions
                if (['metermate_monthly', 'com.metermate.yearly'].includes(productId)) {
                    const isActive = androidData
                        ? true // Android purchases with data are considered active
                        : ['Purchased', 'Restored'].includes(purchase.purchaseState);

                    // Determine status with proper typing
                    const status: SubscriptionStatus = isActive ? 'active' : 'expired';

                    // Add to history
                    subscriptionHistory.push({
                        productId,
                        purchaseTime,
                        status,
                    });

                    // Update active subscription if this is newer
                    if (isActive) {
                        const isMonthly = productId.includes('monthly');
                        if (!activeSubscription ||
                            (activeSubscription === 'yearly' && isMonthly)) {
                            activeSubscription = isMonthly ? 'monthly' : 'yearly';
                        }
                    }
                }
            } catch (e) {
                console.warn('Failed to process purchase:', e);
            }
        }

        console.log('Determined active subscription:', activeSubscription);

        dispatch(updateSubscription({
            activeSubscription,
            history: subscriptionHistory,
        }));

        return activeSubscription;
    } catch (error) {
        console.error('Subscription check failed:', error);
        dispatch(updateSubscription({
            activeSubscription: null,
            history: [],
        }));
        return null;
    }
};
