export const navigatorOptions = () => {
    return {
        cardStyle: {backgroundColor: 'transparent'},
        headerShown: false,
        animationTypeForReplace: 'push',
        animation: 'slide_from_right',
        gestureEnabled: true,
        cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
                opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            },
            overlayStyle: {
                opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                }),
            },
        }),
    };
};
export const headerOptions = () => {
    return {
        headerShown: false,
    };
};
