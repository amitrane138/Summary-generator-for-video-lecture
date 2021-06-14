import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    color: "white",
  },
  title: {
    fontSize: "1.38rem",
    color: "white",
    marginLeft: "5px",
    cursor: "pointer",
  },
  appBar: {
    backgroundColor: "#a60000",
    color: "white",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color:"white",
  },
  headerWrapper: {
    display: "flex",
    alignItems: "center",
  },
  header__wrapper__right: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginRight: "15px",
    color: "white",
    cursor: "pointer",
  },
}));
