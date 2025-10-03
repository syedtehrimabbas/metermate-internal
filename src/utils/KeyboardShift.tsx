import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

type Props = {
  children: React.ReactNode
}

export const KeyboardShift = ({ children }: Props) => {
  const height = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={height + 47}
      behavior="padding"
      style={{ flex: 1 }}
      enabled>
      {children}
    </KeyboardAvoidingView>
  );
};
