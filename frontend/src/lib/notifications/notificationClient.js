/*
Why this is needed?
	-> To decouple the components with the notification implementation. The components should not 
		be use the library/hooks directly, which tightly couples them to the dependeny, making it hard
		to change/modify in future.
	-> Keeps the entire notification feature centeralized for handling any future additions/improvements

-> This can be implemented in mainly two ways, 
	1. Maintining entire notification handlers here, with the notifications that needs to be called.
		And the component will directly invoke the function
	
	2. (Using this) Maintaining only notification provider, whose only job is to take message and show the notification, 
		the other components should pass their respective message only, and should not be aware/known to 
		the underlying declared function excep the single handler

*/

import { useSnackbar } from "notistack";

export const useNotify = () => {
  const { enqueueSnackbar } = useSnackbar();

  return ({ message, kind = "success" }) => {
    enqueueSnackbar(message, { variant: kind });
  };
};
