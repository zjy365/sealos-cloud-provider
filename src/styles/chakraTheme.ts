import { ComponentStyleConfig, defineStyleConfig, extendTheme } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '4px'
  },
  variants: {
    primary: {
      bg: 'primaryblue.600',
      color: 'palegrey.100',
      _hover: {
        bg: 'primaryblue.700'
      },
      _disabled: {
        _hover: {
          bg: 'primaryblue.400 !important'
        }
      }
    },
    outline: {
      bg: 'palegrey.600',
      color: 'primaryblue.600',
      _hover: {
        bg: 'secondaryblue.300'
      },
      _disabled: {
        color: 'primaryblue.400'
      },
      borderWidth: '1px',
      borderColor: 'primaryblue.600'
    }
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'primary'
  }
});

const Modal = {
  defaultProps: {}
};

const Input: ComponentStyleConfig = {
  baseStyle: {},
  sizes: {
    md: {
      field: {
        height: '28px'
      }
    }
  },
  variants: {
    filled: {
      field: {
        border: '0.5px solid',
        background: 'fullgrey.100',
        borderColor: 'fullgrey.400',
        _hover: {
          border: '0.5px solid',
          background: 'fullgrey.100',
          borderColor: 'primaryblue.600'
        },
        _focus: {
          background: 'transparent',
          borderColor: 'primaryblue.600'
        }
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled'
  }
};

const Select = defineStyleConfig({
  sizes: {
    sm: {},
    md: {
      field: {
        height: '28px'
      }
    }
  },
  variants: {
    filled: {
      field: {
        border: '0.5px solid',
        background: 'fullgrey.200',
        borderColor: 'fullgrey.400',
        _hover: {
          border: '0.5px solid',
          background: 'fullgrey.200',
          borderColor: 'primaryblue.600'
        }
      },
      icon: {
        color: 'textgray.600'
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled'
  }
});

const NumberInput = defineStyleConfig({
  baseStyle: {},
  sizes: {
    md: {
      field: {
        height: '28px'
      }
    }
  },
  variants: {
    filled: {
      field: {
        border: '0.5px solid',
        background: 'fullgrey.200',
        borderColor: 'fullgrey.400',
        _hover: {
          border: '0.5px solid',
          background: 'fullgrey.200',
          borderColor: 'primaryblue.600'
        }
      },
      icon: {
        color: 'textgray.600'
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled'
  }
});

const theme = extendTheme({
  fontSizes: {
    sm: '12px',
    base: '12px',
    md: '14px',
    lg: '16px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '22px'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  colors: {
    primaryblue: {
      100: '#E7EEFB',
      200: '#CFDDF8',
      300: '#9EBBF0',
      400: '#6E99E9',
      500: '#3D77E1',
      600: '#0D55DA',
      700: '#0A44AE',
      800: '#083383',
      900: '#052257',
      1000: '#03112C'
    },
    secondaryblue: {
      100: '#FCFCFE',
      200: '#F8F9FE',
      300: '#F1F3FD',
      400: '#EBEDFB',
      500: '#E4E7FA',
      600: '#DDE1F9',
      700: '#B1B4C7',
      800: '#858795'
    },
    fullgrey: {
      100: '#FAFAFC',
      200: '#F4F6FA',
      300: '#E9EDF5',
      400: '#DEE3EF',
      500: '#D3DAEA',
      600: '#C8D1E5',
      700: '#A0A7B7',
      800: '#787D89'
    },
    textgray: {
      100: '#E7E7EB',
      200: '#CFCFD6',
      300: '#9A999D',
      400: '#6F6F85',
      500: '#3F3F5D',
      600: '#0F0F34',
      700: '#0C0C2A',
      800: '#09091F'
    },
    palegrey: {
      100: '#FFFFFF',
      200: '#FEFFFF',
      300: '#FEFEFF',
      400: '#FDFEFE',
      500: '#FDFDFE',
      600: '#FCFDFE'
    },
    error: {
      100: '#FDECEE',
      500: '#F16979',
      600: '#ED4458'
    },
    warn: {
      100: '#FFF2EC',
      400: '#FDB08A',
      600: '#FB7C3C',
      700: '#C96330'
    },
    rose: {
      100: '#FDEAF1'
    },
    purple: {
      300: '#DBBDE9',
      400: '#C99CDF',
      600: '#A55AC9',
      700: '#7167AA'
    }
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '4px', //custom
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  components: {
    Button,
    Modal,
    Input,
    Select,
    NumberInput
  }
});
export default theme;
