import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CustomPopupState(props) {
  return (
    <IconButton size="large">
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <InfoIcon
              color="disabled"
              fontSize="small"
              {...bindTrigger(popupState)}
            />
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box p={1}>
                <Typography>{props.message}</Typography>
              </Box>
            </Popover>
          </div>
        )}
      </PopupState>
    </IconButton>
  );
}
