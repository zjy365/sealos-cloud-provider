import { useToast as useChakraToast, Box, Text, UseToastOptions } from '@chakra-ui/react';

export const useToast = (props: UseToastOptions) => {
  return useChakraToast({
    render(props) {
      const { status, title, description } = props;
      return (
        <Box>
          <Text fontWeight={700}>{title}</Text>
        </Box>
      );
    },
    ...props
  });
};
