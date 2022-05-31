import React from "react";
import { makeStyles } from "@mui/styles";
import { Modal } from "@mui/material";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "16px",

    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    border: "2px solid #000",
    padding: "32px",
    background: "#fff",
  },
  key: {
    fontFamily: "cursive",
    fontSize: "18px",
  },
  value: {
    fontSize: "20px",
    textTransform: "capitalize",
  },
});

const Pokemon = ({ open, handle, data }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={handle}>
      <div className={classes.root}>
        <img
          src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${data.id}.svg`}
          alt="pokemon_img"
        />
        <div>
          <div>
            <span className={classes.key}>Name: </span>
            <span className={`${classes.key} ${classes.value}`}>
              {data.name}
            </span>
          </div>
          <div>
            <span className={classes.key}>Base Experience: </span>
            <span className={`${classes.key} ${classes.value}`}>
              {data.base_experience}
            </span>
          </div>
          <div>
            <span className={classes.key}>Height: </span>
            <span className={`${classes.key} ${classes.value}`}>
              {data.height}
            </span>
          </div>
          <div>
            <span className={classes.key}>Weight: </span>
            <span className={`${classes.key} ${classes.value}`}>
              {data.weight}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Pokemon;
