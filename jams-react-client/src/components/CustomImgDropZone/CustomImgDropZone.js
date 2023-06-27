import React from "react";
import { makeStyles } from "@mui/styles";
import Dropzone from "react-dropzone";
import UploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles({
  dropzoneStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "#0000001A 0% 0% no-repeat padding-box",
    borderRadius: "5px",
    opacity: "1",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
    border: "none",
    height: "10px",
    width: "max-content",
  },
  uploadIconStyle: {
    fontSize: "35px",
    marginBottom: "10px",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
  },
});

function CustomImgDropZone(props) {
  const { onDrop, accept, maxFiles, label, file, handleDelete, ...rest } =
    props;
  const classes = useStyles();

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  };

  return (
    <Dropzone onDrop={handleDrop} accept={accept} maxFiles={maxFiles} {...rest}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className={classes.dropzoneStyle}>
          <input {...getInputProps()} />
          <UploadIcon className={classes.uploadIconStyle} />
          {file ? (
            <>
              <span>{file}</span>
              <button onClick={handleDelete} className={classes.deleteButton}>
                <CloseIcon style={{ color: "red" }} />
              </button>
            </>
          ) : (
            <span>{label}</span>
          )}
        </div>
      )}
    </Dropzone>
  );
}

CustomImgDropZone.defaultProps = {
  accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
  maxFiles: 1,
};

export default CustomImgDropZone;
