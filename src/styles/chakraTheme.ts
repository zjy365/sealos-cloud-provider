import {
  ComponentStyleConfig,
  defineStyle,
  defineStyleConfig,
  extendTheme
} from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '4px'
  },
  variants: {
    primary: {
      bg: 'primary.600',
      color: 'lafWhite.200',
      _hover: {
        bg: 'primary.700'
      },
      _disabled: {
        _hover: {
          bg: 'primary.500 !important'
        }
      }
    },
    outline: {
      bg: 'grey.600',
      color: 'blue.600',
      _hover: {
        bg: 'blue.300'
      },
      _disabled: {
        color: 'blue.400'
      },
      borderWidth: '1px',
      borderColor: 'blue.600'
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
  baseStyle: {
    field: {}
  },
  sizes: {
    xs: {
      field: {
        borderRadius: 'sm',
        fontSize: 'xs',
        height: 6,
        paddingX: 2
      }
    },
    sm: {
      field: {
        borderRadius: 'sm',
        fontSize: 'sm',
        height: 8,
        paddingX: 3
      }
    },
    md: {
      field: {
        borderRadius: 'md',
        fontSize: 'md',
        height: 10,
        paddingX: 4
      }
    },
    lg: {
      field: {
        borderRadius: 'md',
        fontSize: 'lg',
        height: 12,
        paddingX: 4
      }
    }
  },
  variants: {
    outline: {
      field: {
        background: '#fff',
        border: '1px solid',
        borderColor: 'transparent',
        _focus: {
          background: 'transparent',
          borderColor: '#3182ce'
        }
      }
    },
    filled: {
      field: {
        background: 'lafWhite.600',
        border: '1px solid',
        borderColor: 'transparent',
        _hover: {
          background: 'lafWhite.600'
        },
        _focus: {
          background: 'transparent',
          borderColor: 'primary.400'
        }
      },
      addon: {
        background: 'lafWhite.600'
      }
    },

    unstyled: {
      field: {
        background: 'transparent',
        borderRadius: 'md',
        height: 'auto',
        paddingX: 0
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'filled'
  }
};

const Tabs = {
  variants: {
    'soft-rounded': {
      tab: {
        borderRadius: '4px',
        color: 'grayModern.500',
        _selected: {
          color: 'grayModern.900',
          bg: 'lafWhite.600',
          borderRadius: '4px'
        }
      }
    }
  }
};

const Table = {
  baseStyle: {},
  variants: {
    simple: {
      parts: ['th', 'td'],
      th: {
        border: 'none',
        fontWeight: '400',
        color: 'grayModern.500'
      },
      td: {
        border: 'none'
      }
    },
    border: {
      parts: ['th', 'td'],
      th: {
        borderWidth: 1,
        borderColor: 'grayModern.100',
        background: 'lafWhite.300'
      },
      td: {
        borderWidth: 1,
        borderColor: 'grayModern.100',
        background: 'lafWhite.300'
      }
    }
  },
  defaultProps: {
    variant: 'border'
  }
};

const Select = {
  variants: {
    filled: {
      field: {
        background: 'lafWhite.600',
        borderWidth: 1,
        _hover: {
          background: 'lafWhite.600'
        },
        _focusVisible: {
          background: 'lafWhite.200',
          borderColor: 'primary.400'
        }
      },
      icon: {
        color: 'grayIron.600'
      }
    }
  }
};

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
    primary: {
      100: '#E7EEFB',
      200: '#CFDDF8',
      300: '#9EBBF0',
      400: '#6E99E9',
      500: '#33BAB1',
      600: '#0D55DA',
      700: '#0A44AE',
      800: '#083383',
      900: '#083383',
      1000: '#03112C'
    },
    blue: {
      100: '#E7EEFB',
      300: '#F1F3FD',
      400: '#6E99E9',
      600: '#0D55DA'
    },
    grey: {
      400: '#DEE3EF',
      600: '#FCFDFE'
    },
    lafWhite: {
      100: '#FEFEFE',
      200: '#FDFDFE',
      300: '#FBFBFC',
      400: '#F8FAFB',
      500: '#F6F8F9',
      600: '#F4F6F8',
      700: '#C3C5C6',
      800: '#929495',
      900: '#626263',
      1000: '#313132'
    },
    grayModern: {
      100: '#EFF0F1',
      200: '#DEE0E2',
      300: '#BDC1C5',
      400: '#9CA2A8',
      500: '#7B838B',
      600: '#5A646E',
      700: '#485058',
      800: '#363C42',
      900: '#24282C',
      1000: '#121416'
    },
    grayIron: {
      100: '#F3F3F3',
      200: '#E6E6E7',
      300: '#CDCDD0',
      400: '#B4B4B8',
      500: '#9B9BA1',
      600: '#828289',
      700: '#68686E',
      800: '#4E4E52',
      900: '#343437',
      1000: '#1A1A1B'
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
    },
    frostyNightfall: {
      200: '#EAEBF0'
    }
  },
  components: {
    Button,
    Modal,
    Input,
    Tabs,
    Table,
    Select
  }
});
export default theme;
