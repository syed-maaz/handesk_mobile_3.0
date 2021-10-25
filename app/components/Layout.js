import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';

import HeaderPage from './Header';

function Layout({ children, containerStyle, headerTitle }) {
  return (
    <Container style={[styles.container, containerStyle]}>
      <HeaderPage title={headerTitle} />
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9F9'
  }
});

export default Layout;