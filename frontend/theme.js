// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        overflow: 'hidden',
      },
    },
  },
});

export default theme;