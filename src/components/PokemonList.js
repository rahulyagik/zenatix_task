import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import CardUi from "./Card";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Pokemon from "./Pokemon";

const useStyles = makeStyles({
  root: {
    maxWidth: "80%",
    margin: "50px auto",
  },
  pokemonCardWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "40px 16px",
    textAlign: "center",
  },
  pokemonCard: {
    flex: "0 0 24%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "60px",
  },
  pokemonWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
  inputWrap: {
    display: "flex",
    justifyContent: "center",
    margin: "32px",
  },
  input: {
    padding: "8px",
    borderRadius: "8px",
    minWidth: "70%",
  },
});

const PokemonList = () => {
  const classes = useStyles();
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [searchInput, setSearchInput] = useState({
    value: "",
  });
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const filteredPokemon = pokemonData.filter((pokemon) => {
    if (searchInput.value === "") {
      return pokemonData;
    } else {
      return pokemon.name.includes(searchInput.value);
    }
  });
  console.log(filteredPokemon, searchInput, pokemonData);

  const handleModal = () => {
    setOpenModal((previous) => !previous);
  };

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(initialURL);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      await loadPokemon(response.data.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await axios.get(nextUrl);
    await loadPokemon(data.data.results);
    setNextUrl(data.data.next);
    setPrevUrl(data.data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await axios.get(prevUrl);
    await loadPokemon(data.data.results);
    setNextUrl(data.data.next);
    setPrevUrl(data.data.previous);
    setLoading(false);
  };

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data?.map(async (pokemon) => {
        let pokemonRecord = await axios.get(pokemon.url);
        return pokemonRecord.data;
      })
    );
    setPokemonData(_pokemonData);
  };

  const getPokeData = (id) => {
    let pokeData = pokemonData.find((poke) => poke.id === id);
    setPokemon(pokeData);
  };

  const searchInputHandler = (event) => {
    const { name, value } = event.target;
    setSearchInput((previous) => {
      return { ...previous, [name]: value };
    });
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.inputWrap}>
          <input
            className={classes.input}
            name="value"
            value={searchInput.value}
            onChange={searchInputHandler}
            placeholder="Search by name"
          />
        </div>
        <div className={classes.pokemonCardWrapper}>
          {filteredPokemon.map((poke) => {
            return (
              <div
                key={poke.id}
                className={classes.pokemonCard}
                onClick={(e) => {
                  handleModal();
                  getPokeData(poke.id);
                }}
              >
                <CardUi name={poke.name} id={poke.id} />
              </div>
            );
          })}
        </div>
        <div className={classes.buttons}>
          <Button variant="outlined" onClick={prev}>
            Previous
          </Button>
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        </div>
      </div>

      <Pokemon open={openModal} handle={handleModal} data={pokemon} />
    </>
  );
};

export default PokemonList;
