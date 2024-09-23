import { styled } from "@mui/material/styles";
import {InputBase} from '@mui/material';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // Ensure enough space for the icon
    width: "100%",
}));
export default StyledInputBase;